import BN from 'bn.js';

export type AssetAmount = {
    amount: BN;
    inputAmount: number;
    amountFormatted: string;
};

export type AssetBalance = {
    assetId: number;
    balance: BN;
    balanceFormatted: string;
    name?: string;
    shareToken?: boolean;
};

export type AssetRecord = {
    assetId: number;
    name: string;
    icon?: string;
};

export type PoolInfo = {
    [key: string]: {
      poolAssets: number[];
      poolAssetNames: string[];
      shareToken: number;
    };
};

export type TokenTradeMap = { [key: number]: number[] };