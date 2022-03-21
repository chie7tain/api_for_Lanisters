"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feeModel_1 = __importDefault(require("../models/feeModel"));
const memoize_one_1 = __importDefault(require("memoize-one"));
const lodash_1 = require("lodash");
function itemRoutes(fastify, options, done) {
    const createFeeSpec = (req, reply) => __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        try {
            let { FeeConfigurationSpec } = req.body;
            let fees = FeeConfigurationSpec.split("\n");
            console.log(fees);
            let feeSpecList = [];
            console.log(feeSpecList);
            feeSpecList = fees.map((fee) => {
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
            let fee = yield feeModel_1.default.create(feeSpecList);
            reply.send(fee);
            // reply.send(feeList);
        }
        catch (err) {
            console.log(err);
        }
    });
    const computeTransactionFee = (req, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            // const transaction = await TransactionModel.create(req.body);
            let { ID, Amount, Currency, CurrencyCountry, Customer, PaymentEntity } = req.body;
            let localFeeConfig;
            let internationalFeeconfig;
            let feeHolder = yield feeModel_1.default.find({});
            // check fee locale
            if (CurrencyCountry === PaymentEntity.Country) {
                // transaction is local
                // find fee configuration that matches local ones
                // localFeeConfig = feeHolder.find({ feeLocale: { $ne: "INTL" } });
                localFeeConfig = feeHolder.filter((fee) => fee.feeLocale !== "INTL");
            }
            else {
                // transaction is international
                // find fee configuration that matches international ones
                // internationalFeeconfig = feeHolder.find({ feeLocale: "INTL" });
                internationalFeeconfig = feeHolder.filter((fee) => fee.feeLocale === "INTL");
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
                    if (fee.feeEntityProperty === PaymentEntity.Brand ||
                        fee.feeEntityProperty === "*") {
                        return true;
                    }
                }
            });
            console.log(feeEntityArr);
            // check if fee entity type is empty
            // create a ranker function to rank the fee configs
            let ranker = (feeConfig) => {
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
            let memoizeRanker = (0, memoize_one_1.default)(ranker, lodash_1.isEqual);
            // rank the fee configs
            let rankedFeeConfigs = feeEntityArr
                .map(memoizeRanker)
                .sort((a, b) => {
                return a.rank === b.rank ? 0 : a.rank > b.rank ? -1 : 1;
            });
            console.log(rankedFeeConfigs);
            // get the fee config to use from feeEntityArr
            let feeConfigToUse = feeEntityArr.filter((fee) => fee.feeId === rankedFeeConfigs[0].feeConfigId);
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
            }
            else if (feeType === "FLAT") {
                appliedFeeValue = Number(feeValue.split(":")[0]);
            }
            else if (feeType === "FLAT_PERC") {
                let flatFee = Number(feeValue.split(":")[0]);
                let percFee = Number(feeValue.split(":")[1]);
                console.log(typeof flatFee, typeof percFee);
                appliedFeeValue = flatFee + (percFee * Amount) / 100;
            }
            if (Customer.BearsFee) {
                chargeAmount = Amount + appliedFeeValue;
            }
            else {
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
            reply.status(200).send(Object.assign({}, appliedFee));
        }
        catch (error) {
            console.log(error);
            reply.status(400).send({
                error,
            });
        }
    });
    fastify.post("/fees", createFeeSpec);
    fastify.post("/compute-transaction-fee", computeTransactionFee);
    done();
}
exports.default = itemRoutes;
