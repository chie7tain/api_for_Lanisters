// let fee = await FeeModel.findOne({
//   where: {
//     feeEntity: Customer.PaymentEntity.Type,
//     feeEntityProperty: Customer.PaymentEntity.ID,
//     feeCurrency: Merchant.Currency,
//     feeLocale: Merchant.CurrencyCountry,
//   },
// });
// if (fee) {
//   let { feeType, feeValue } = fee;
//   if (feeType === "PERC") {
//     appliedFeeValue = (feeValue / 100) * Amount;
//   } else if (feeType === "FLAT") {
//     appliedFeeValue = feeValue;
//   } else if (feeType === "FLAT_PERC") {
//     appliedFeeValue = feeValue + ((feeValue / 100) * Amount);
//   }
//   chargeAmount = Amount + appliedFeeValue;
//   settlementAmount = chargeAmount - appliedFeeValue;
//   appliedFeeId = fee.feeId;
//   appliedFee = {
//     appliedFeeId,
//     appliedFeeValue,
//     chargeAmount,
//     settlementAmount,
//   };
// }
