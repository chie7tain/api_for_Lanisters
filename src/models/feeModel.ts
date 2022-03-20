import mongoose from "mongoose";
// {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}
// {
//     "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
// }
const feeSchema = new mongoose.Schema({
  feeId: {
    type: String,
    required: true,
    unique: true,
  },
  feeCurrency: {
    type: String,
    required: true,
  },
  feeLocale: {
    type: String,
    required: true,
  },
  feeEntity: {
    type: String,
    required: true,
  },
  feeEntityProperty: {
    type: String,
    required: true,
  },
  feeType: {
    type: String,
    required: true,
  },
  feeValue: {
    type: String,
    required: true,
  },
});

// create unique index on feeId
feeSchema.index({ feeId: 1 }, { unique: true });

const FeeModel = mongoose.model("Fee", feeSchema);

export default FeeModel;
