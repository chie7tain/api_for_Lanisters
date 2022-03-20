import { Request, Response } from "express";
import FeeModel from "../models/feeModel";
import memoizeOne from "memoize-one";
import { isEqual } from "lodash";
import TransactionModel from "../models/transactionModel";

const computeTransactionFee = async (req: Request, res: Response) => {
  try {
    // const transaction = await TransactionModel.create(req.body);

    let { ID, Amount, Currency, CurrencyCountry, Customer, PaymentEntity } =
      req.body;
    let localFeeConfig;
    let internationalFeeconfig;
    let feeHolder = await FeeModel.find({});
    // check fee locale
    if (CurrencyCountry === PaymentEntity.Country) {
      console.log("local");
      // transaction is local
      // find fee configuration that matches local ones
      // localFeeConfig = feeHolder.find({ feeLocale: { $ne: "INTL" } });
      localFeeConfig = feeHolder.filter((fee) => fee.feeLocale !== "INTL");
    } else {
      // transaction is international
      // find fee configuration that matches international ones
      // internationalFeeconfig = feeHolder.find({ feeLocale: "INTL" });
      internationalFeeconfig = feeHolder.filter(
        (fee) => fee.feeLocale === "INTL"
      );
    }
    //  select the feeconfig to use
    let feeConfig = localFeeConfig || internationalFeeconfig;
    //  check if fee config is empty
    if (!feeConfig) {
      throw new Error("No fee configuration found");
    }
    // check fee entity type
    let feeEntityArr = feeConfig.filter((fee) => {
      if (fee.feeEntity === PaymentEntity.Type || fee.feeEntity === "*") {
        if (
          fee.feeEntityProperty === PaymentEntity.Brand ||
          fee.feeEntityProperty === "*"
        ) {
          return true;
        }
      }
    });
    console.log(feeEntityArr);
    // check if fee entity type is empty

    // create a ranker function to rank the fee configs
    let ranker = (feeConfig: {
      feeId: string;
      feeCurrency: string;
      feeLocale: string;
      feeType: string;
      feeEntity: string;
      feeProperty: string;
    }) => {
      let feeConfigRanker = {
        feeConfigId: feeConfig.feeId,
        rank: 4,
      };
      // check if the fee config has a * value
      if (feeConfig.feeCurrency === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeLocale === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeType === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeEntity === "*") {
        feeConfigRanker.rank -= 1;
      }
      // check if the fee config has a * value
      if (feeConfig.feeProperty === "*") {
        feeConfigRanker.rank -= 1;
      }
      return feeConfigRanker;
    };
    // memoize the ranker function
    let memoizeRanker = memoizeOne(ranker, isEqual);
    // rank the fee configs
    let rankedFeeConfigs = feeEntityArr
      .map(memoizeRanker)
      .sort((a: any, b: any) => {
        return a.rank === b.rank ? 0 : a.rank > b.rank ? -1 : 1;
      });
    console.log(rankedFeeConfigs);
    // get the fee config to use from feeEntityArr

    let feeConfigToUse = feeEntityArr.filter(
      (fee) => fee.feeId === rankedFeeConfigs[0].feeConfigId
    );
    console.log(feeConfigToUse);

    // use the fee config to compute the fee
    let [fee] = feeConfigToUse;

    let { feeType, feeValue } = fee;
    let appliedFeeId = "";
    let appliedFeeValue = 0;
    let chargeAmount = 0;
    let settlementAmount = 0;
    let appliedFee = {
      appliedFeeId,
      appliedFeeValue,
      chargeAmount,
      settlementAmount,
    };
    if (feeType === "PERC") {
      appliedFeeValue = (feeValue * Amount) / 100;
    } else if (feeType === "FLAT") {
      appliedFeeValue = Number(feeValue.split(":")[0]);
    } else if (feeType === "FLAT_PERC") {
      let flatFee = Number(feeValue.split(":")[0]);
      let percFee = Number(feeValue.split(":")[1]);
      console.log(typeof flatFee, typeof percFee);
      appliedFeeValue = flatFee + (percFee * Amount) / 100;
    }
    if (Customer.BearsFee) {
      chargeAmount = Amount + appliedFeeValue;
    } else {
      chargeAmount = Amount;
    }
    settlementAmount = chargeAmount - appliedFeeValue;
    appliedFeeId = fee.feeId;
    appliedFee = {
      appliedFeeId,
      appliedFeeValue,
      chargeAmount,
      settlementAmount,
    };
    res.status(200).json({
      ...appliedFee,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
};
export default computeTransactionFee;
