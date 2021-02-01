"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBalanceAmount = exports.bnToDec = exports.decToBn = void 0;
const util_1 = require("@polkadot/util");
const util_2 = require("@polkadot/util");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const decimalPlaces = 12;
const formatBalanceAmount = (balance) => {
    const bnDecimals = util_1.bnToBn(decimalPlaces);
    //TODO: Precision
    const baseAmount = util_1.bnToBn(10).pow(bnDecimals.sub(util_1.bnToBn(4)));
    const inputAmount = balance.div(baseAmount).toNumber() / Math.pow(10, 4);
    return {
        amount: balance,
        inputAmount: inputAmount,
        amountFormatted: util_2.formatBalance(balance),
    };
};
exports.formatBalanceAmount = formatBalanceAmount;
const decToBn = (bignumber) => util_1.bnToBn(bignumber.toString());
exports.decToBn = decToBn;
const bnToDec = (bn) => new bignumber_js_1.default(bn.toString());
exports.bnToDec = bnToDec;
