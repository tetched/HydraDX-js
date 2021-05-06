import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { ApiPromise } from '@polkadot/api';

export interface HydraApiPromise extends ApiPromise {
    hydraDx?: any,
}

export type ApiListeners = {
    error?: (e: Error) => void;
    connected?: (api?: ApiPromise) => void;
    disconnected?: () => void;
    ready?: (api?: ApiPromise) => void;
};

export type AssetAmount = {
    amount: BigNumber;
    inputAmount: number;
    amountFormatted: string;
};

export type AssetBalance = {
    assetId: number;
    balance: BigNumber;
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

export type ChainEventCallback = ({
   id,
   index,
   progress,
}: {
    id: string;
    index?: number;
    progress: number;
}) => void;