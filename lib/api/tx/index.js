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
exports.swapSMTrade = exports.withdrawLiquiditySMPool = exports.addLiquiditySMPool = exports.mintAssetSMWallet = void 0;
const api_1 = __importDefault(require("../../api"));
const util_1 = require("@polkadot/util");
const utils_1 = require("../../utils");
function mintAssetSMWallet(account, assetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = api_1.default.getApi();
        if (api && account) {
            const signer = yield api_1.default.getSinger(account);
            api.tx.faucet
                .mint(assetId, 100000000000000)
                .signAndSend(account, { signer: signer }, ({ events, status }) => {
                if (status.isReady)
                    return Promise.resolve();
                // TODO:STUFF
            });
        }
    });
}
exports.mintAssetSMWallet = mintAssetSMWallet;
function addLiquiditySMPool(account, asset1, asset2, amount, spotPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const api = api_1.default.getApi();
            const maxSellPrice = utils_1.decToBn(utils_1.bnToDec(amount).multipliedBy(spotPrice * 1.1));
            if (api && account) {
                const signer = yield api_1.default.getSinger(account);
                api.tx.amm
                    .addLiquidity(asset1, asset2, amount, maxSellPrice)
                    .signAndSend(account, { signer: signer }, ({ status }) => {
                    resolve(status);
                });
            }
        }));
    });
}
exports.addLiquiditySMPool = addLiquiditySMPool;
function withdrawLiquiditySMPool(account, asset1, asset2, liquidityBalance, selectedPool, percentage) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const api = api_1.default.getApi();
            if (api && account && selectedPool) {
                const signer = yield api_1.default.getSinger(account);
                const liquidityToRemove = liquidityBalance
                    .div(util_1.bnToBn(100))
                    .mul(percentage);
                api.tx.amm
                    .removeLiquidity(asset1, asset2, liquidityToRemove)
                    .signAndSend(account, { signer: signer }, ({ status }) => {
                    resolve(status);
                });
            }
        }));
    });
}
exports.withdrawLiquiditySMPool = withdrawLiquiditySMPool;
function swapSMTrade(account, asset1, asset2, amount, actionType) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const api = api_1.default.getApi();
            if (api && account && amount && asset1 != null && asset2 != null) {
                const signer = yield api_1.default.getSinger(account);
                if (actionType === 'buy') {
                    api.tx.exchange
                        //TODO: CALCULATE LIMITS FROM SPOT PRICE
                        .buy(asset1, asset2, amount, util_1.bnToBn('100000000000000000'), false)
                        .signAndSend(account, { signer: signer }, ({ events, status }) => {
                        resolve({ events, status });
                    })
                        .catch(() => {
                        reject();
                    });
                }
                else {
                    api.tx.exchange
                        //TODO: CALCULATE LIMITS FROM SPOT PRICE
                        .sell(asset1, asset2, amount, util_1.bnToBn(1000), false)
                        .signAndSend(account, { signer: signer }, ({ events, status }) => {
                        resolve({ events, status });
                    })
                        .catch(() => {
                        reject();
                    });
                }
            }
        }));
    });
}
exports.swapSMTrade = swapSMTrade;
;
