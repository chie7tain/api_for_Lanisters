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
const createFeeSpec = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.send(fee);
        // res.send(feeList);
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = createFeeSpec;
