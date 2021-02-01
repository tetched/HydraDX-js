import BN from 'bn.js';
export declare type AssetAmount = {
    amount: BN;
    inputAmount: number;
    amountFormatted: string;
};
export declare type AssetBalance = {
    assetId: number;
    balance: BN;
    balanceFormatted: string;
    name?: string;
    shareToken?: boolean;
};
export declare type AssetRecord = {
    assetId: number;
    name: string;
    icon?: string;
};
export declare type PoolInfo = {
    [key: string]: {
        poolAssets: number[];
        poolAssetNames: string[];
        shareToken: number;
    };
};
export declare type TokenTradeMap = {
    [key: number]: number[];
};
