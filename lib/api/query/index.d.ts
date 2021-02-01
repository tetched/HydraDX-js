/// <reference types="bn.js" />
import { AssetBalance, AssetRecord, PoolInfo, TokenTradeMap } from '../../types';
declare function syncAssetBalancesSMWallet(account: any): Promise<AssetBalance[]>;
declare function syncAssetListSMWallet(): Promise<AssetRecord[]>;
declare function syncPoolsSMPool(): Promise<{
    tokenTradeMap: TokenTradeMap;
    shareTokenIds: number[];
    poolInfo: PoolInfo;
} | undefined>;
declare function getSpotPriceSMTrade(asset1: string, asset2: string): Promise<any>;
declare function getSellPriceSMTrade(asset1: string, asset2: string, tradeAmount: any, actionType: string): Promise<import("bn.js") | undefined>;
export { syncAssetBalancesSMWallet, syncAssetListSMWallet, syncPoolsSMPool, getSpotPriceSMTrade, getSellPriceSMTrade, };
