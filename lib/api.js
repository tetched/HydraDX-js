"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
const extension_dapp_1 = require("@polkadot/extension-dapp");
const query = __importStar(require("./api/query"));
const tx = __importStar(require("./api/tx"));
let api;
const getApi = () => {
    return api;
};
const getSinger = (account) => __awaiter(void 0, void 0, void 0, function* () {
    const injector = yield extension_dapp_1.web3FromAddress(account);
    return injector.signer;
});
const syncWallets = (updateFunction) => __awaiter(void 0, void 0, void 0, function* () {
    // returns an array of all the injected sources
    // (this needs to be called first, before other requests)
    const allInjected = yield extension_dapp_1.web3Enable('HACK.HydraDX.io');
    if (!allInjected.length) {
        return null;
    }
    else {
        extension_dapp_1.web3AccountsSubscribe(updateFunction);
        return null;
    }
});
const initialize = (apiUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const local = window.location.hostname === '127.0.0.1' ||
            window.location.hostname === 'localhost';
        const serverAddress = local
            ? 'ws://127.0.0.1:9944'
            : (apiUrl || 'wss://hack.hydradx.io:9944');
        const wsProvider = new api_1.WsProvider(serverAddress);
        new api_1.ApiPromise({
            provider: wsProvider,
            rpc: {
                amm: {
                    getSpotPrice: {
                        description: 'Get spot price',
                        params: [
                            {
                                name: 'asset1',
                                type: 'AssetId',
                            },
                            {
                                name: 'asset2',
                                type: 'AssetId',
                            },
                            {
                                name: 'amount',
                                type: 'Balance',
                            },
                        ],
                        type: 'BalanceInfo',
                    },
                    getSellPrice: {
                        description: 'Get AMM sell price',
                        params: [
                            {
                                name: 'asset1',
                                type: 'AssetId',
                            },
                            {
                                name: 'asset2',
                                type: 'AssetId',
                            },
                            {
                                name: 'amount',
                                type: 'Balance',
                            },
                        ],
                        type: 'BalanceInfo',
                    },
                    getBuyPrice: {
                        description: 'Get AMM buy price',
                        params: [
                            {
                                name: 'asset1',
                                type: 'AssetId',
                            },
                            {
                                name: 'asset2',
                                type: 'AssetId',
                            },
                            {
                                name: 'amount',
                                type: 'Balance',
                            },
                        ],
                        type: 'BalanceInfo',
                    },
                },
            },
            types: {
                Amount: 'i128',
                AmountOf: 'Amount',
                Address: 'AccountId',
                LookupSource: 'AccountId',
                CurrencyId: 'AssetId',
                CurrencyIdOf: 'AssetId',
                BalanceInfo: {
                    amount: 'Balance',
                    assetId: 'AssetId',
                },
                IntentionID: 'Hash',
                IntentionType: {
                    _enum: ['SELL', 'BUY'],
                },
                Intention: {
                    who: 'AccountId',
                    asset_sell: 'AssetId',
                    asset_buy: 'AssetId',
                    amount_sell: 'Balance',
                    amount_buy: 'Balance',
                    trade_limit: 'Balance',
                    discount: 'bool',
                    sell_or_buy: 'IntentionType',
                    intention_id: 'IntentionID',
                },
                Price: 'Balance',
            },
        }).isReadyOrError
            .then(apiResponse => {
            api = apiResponse;
            api.hydraDx = {
                query,
                tx,
            };
            resolve(api);
        })
            .catch(e => {
            reject(e);
        });
    }));
});
exports.default = {
    initialize,
    syncWallets,
    getApi,
    getSinger,
};
