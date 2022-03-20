"use strict";
// The transaction payload is an object containing the following fields:
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ID The unique id of the transaction.
// Amount The non-negative, numeric transaction amount.
// Currency The transaction currency.
// CurrencyCountry Country the transaction currency is applicable in. Useful for determining the transaction locale.
// Customer An object containing the customer information. It has the following fields:
// ID Unique id of the customer .
// EmailAddress Email address of the customer.
// FullName Full name of the customer.
// BearsFee Indicates whether or not the customer is set to bear the transaction cost. If this is true, the final amount to charge the customer is Amount + ApplicableFee, if not, the customer is charged the same value as the transaction amount.
// PaymentEntity An object representing the payment entity to be charged for the transaction. It has the following fields:
// ID - Unique id of the entity.
// Issuer - The issuing company / organization for the entity e.g. Banks, Telco Providers / Wallet Service Providers.
// Brand - Applicable only to card-type transactions e.g. MASTERCARD, VISA, AMEX, VERVE e.t.c.
// Number The payment entity number (masked pan in case of credit/debit cards, bank account numbers, mobile numbers, wallet ids e.t.c.)
// SixID The first six digits of the payment entity number.
// Type The type of the entity e.g. CREDIT-CARD, DEBIT-CARD, BANK-ACCOUNT, USSD, WALLET-ID
// Country The issuing country of the entity e.g. NG, US, GH, KE e.t.c. It's used together with the CurrencyCountry to determine a transaction's locale.
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    currencyCountry: {
        type: String,
        required: true,
    },
    customer: {
        id: {
            type: String,
            required: true,
        },
        emailAddress: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        bearsFee: {
            type: Boolean,
            default: false,
            required: true,
        },
        paymentEntity: {
            id: {
                type: String,
                required: true,
            },
            issuer: {
                type: String,
                required: true,
            },
            brand: {
                type: String,
                required: true,
            },
            number: {
                type: String,
                required: true,
            },
            sixID: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
        },
    },
});
const TransactionModel = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = TransactionModel;
