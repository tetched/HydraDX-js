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
exports.getSellPriceSMTrade = exports.getSpotPriceSMTrade = exports.syncPoolsSMPool = exports.syncAssetListSMWallet = exports.syncAssetBalancesSMWallet = void 0;
const util_1 = require("@polkadot/util");
const api_1 = __importDefault(require("../../api"));
function syncAssetBalancesSMWallet(account) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = api_1.default.getApi();
        const balances = [];
        if (account && api) {
            const multiTokenInfo = yield api.query.tokens.accounts.entries(account);
            const baseTokenInfo = yield api.query.system.account(account);
            const baseTokenBalance = util_1.bnToBn(baseTokenInfo.data.free);
            balances[0] = {
                assetId: 0,
                balance: baseTokenBalance,
                balanceFormatted: util_1.formatBalance(baseTokenBalance),
            };
            multiTokenInfo.forEach(record => {
                let assetId = 99999;
                const assetInfo = record[0].toHuman();
                if (Array.isArray(assetInfo) && typeof assetInfo[1] === 'string') {
                    assetId = parseInt(assetInfo[1]);
                }
                const assetBalances = api.createType('AccountData', record[1]);
                const balance = util_1.bnToBn(assetBalances.free);
                const balanceFormatted = util_1.formatBalance(balance);
                balances[assetId] = {
                    assetId,
                    balance,
                    balanceFormatted,
                };
            });
        }
        return balances;
    });
}
exports.syncAssetBalancesSMWallet = syncAssetBalancesSMWallet;
function syncAssetListSMWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        const api = api_1.default.getApi();
        if (!api)
            return [];
        const assetIds = yield api.query.assetRegistry.assetIds.entries();
        const assetList = [{ assetId: 0, name: 'HDX' }];
        // TODO: Better way to parse mapped records
        assetIds.forEach(([assetName, id]) => {
            var _a;
            const assetId = parseInt(api.createType('Option<u32>', id).toString());
            const name = ((_a = assetName.toHuman()) === null || _a === void 0 ? void 0 : _a.toString()) || '0xERR';
            assetList[assetId] = { assetId, name };
        });
        return assetList;
    });
}
exports.syncAssetListSMWallet = syncAssetListSMWallet;
;
function syncPoolsSMPool() {
    return __awaiter(this, void 0, void 0, function* () {
        const api = api_1.default.getApi();
        if (!api)
            return;
        const allPools = yield api.query.amm.poolAssets.entries();
        const allTokens = yield api.query.amm.shareToken.entries();
        const poolInfo = {};
        const shareTokenIds = [];
        const tokenTradeMap = {};
        allPools.forEach(([key, value]) => {
            var _a;
            const poolId = ((_a = key.toHuman()) === null || _a === void 0 ? void 0 : _a.toString()) || 'ERR';
            const poolAssets = api
                .createType('Vec<u32>', value)
                .map(assetId => assetId.toNumber())
                .sort((a, b) => a - b);
            poolAssets.forEach((asset, key) => {
                const otherAsset = poolAssets[+!key];
                if (!tokenTradeMap[asset])
                    tokenTradeMap[asset] = [];
                if (tokenTradeMap[asset].indexOf(otherAsset) === -1) {
                    tokenTradeMap[asset].push(otherAsset);
                }
            });
            poolInfo[poolId] = {
                poolAssets,
                shareToken: 99999,
                poolAssetNames: [],
            };
        });
        allTokens.forEach(([key, value]) => {
            var _a;
            const poolId = ((_a = key.toHuman()) === null || _a === void 0 ? void 0 : _a.toString()) || 'ERR';
            const shareToken = api.createType('u32', value).toNumber();
            shareTokenIds.push(shareToken);
            poolInfo[poolId].shareToken = shareToken;
        });
        return {
            tokenTradeMap,
            shareTokenIds,
            poolInfo
        };
    });
}
exports.syncPoolsSMPool = syncPoolsSMPool;
function getSpotPriceSMTrade(asset1, asset2) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = api_1.default.getApi();
        if (api) {
            // @ts-expect-error TS-2339
            const amountData = yield api.rpc.amm.getSpotPrice(asset1, asset2, 1000000000000);
            const amount = amountData.amount;
            return amount;
        }
    });
}
exports.getSpotPriceSMTrade = getSpotPriceSMTrade;
;
function getSellPriceSMTrade(asset1, asset2, tradeAmount, actionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = api_1.default.getApi();
        if (api) {
            let amount = util_1.bnToBn(0);
            if (tradeAmount) {
                if (actionType === 'sell') {
                    // @ts-expect-error TS-2339
                    const amountData = yield api.rpc.amm.getSellPrice(asset1, asset2, tradeAmount);
                    amount = amountData.amount;
                }
                else {
                    // @ts-expect-error TS-2339
                    const amountData = yield api.rpc.amm.getBuyPrice(asset1, asset2, tradeAmount);
                    amount = amountData.amount;
                }
            }
            return amount;
        }
    });
}
exports.getSellPriceSMTrade = getSellPriceSMTrade;
;
