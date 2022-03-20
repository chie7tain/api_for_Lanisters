"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
// const dbString =
//   "mongodb+srv://chie7tain:2A84scE0NCKxgVaK@cluster1.ku1s7.mongodb.net/lanisterpay?retryWrites=true&w=majority";
const DB = (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB)
    .then(() => {
    console.log("connected to database");
})
    .catch((err) => {
    console.log("error connecting to database", err);
});
const port = process.env.PORT || 3000;
const server = (0, http_1.createServer)(app_1.default);
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
