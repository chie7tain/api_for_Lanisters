import { Request, Response } from "express";
import FeeModel from "../models/feeModel";

const createFeeSpec = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    let { FeeConfigurationSpec } = req.body;
    let fees = FeeConfigurationSpec.split("\n");
    console.log(fees);
    let feeSpecList: {}[] = [];

    console.log(feeSpecList);
    feeSpecList = fees.map((fee: string) => {
      let feeDetails = fee.split(" ");
      let feeId = feeDetails[0];
      let feeCurrency = feeDetails[1];
      let feeLocale = feeDetails[2];
      let feeEntity = feeDetails[3].split("(")[0];
      let feeEntityProperty = feeDetails[3].split("(")[1].replace(")", "");
      let feeType = feeDetails[6];
      let feeValue = feeDetails[7];
      let feeSpec = {
        feeId,
        feeCurrency,
        feeLocale,
        feeEntity,
        feeEntityProperty,
        feeType,
        feeValue,
      };
      return feeSpec;
    });
    // create a hashmap of all the fees

    let feeMap = {};
    feeSpecList.forEach((feeSpec) => {
      //@ts-ignore
      feeMap[feeSpec.feeId] = feeSpec;
    });

    let fee = await FeeModel.create(feeSpecList);
    res.send(fee);
    // res.send(feeList);
  } catch (err) {
    console.log(err);
  }
};
export default createFeeSpec;
