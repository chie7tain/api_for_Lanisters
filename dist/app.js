"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const compute_transaction_fee_1 = __importDefault(require("./controllers/compute-transaction-fee"));
const fees_1 = __importDefault(require("./controllers/fees"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.post("/fees", fees_1.default);
app.post("/compute-transaction-fee", compute_transaction_fee_1.default);
exports.default = app;
