import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { ApiPromise } from '@polkadot/api';
import { AddressOrPair } from '@polkadot/api/types';

export interface HydraApiPromise extends ApiPromise {
  hydraDx?: any;
}

export type ApiListeners = {
  error?: (e: Error) => void;
  connected?: (api?: ApiPromise) => void;
  disconnected?: () => void;
  ready?: (api?: ApiPromise) => void;
  onTxEvent: (eventData: any) => void;
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
  type,
  data,
}: {
  type?: string;
  data: SuccessEventData[];
}) => void;

export type TradeTransaction = {
  index: number;
  accountId: AddressOrPair;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  expectedOut: string;
  type: string;
  slippage: BigNumber;
  progress: number;
};

export type TransactionDetails = {
  id: number | null;
  slippage?: BigNumber;
  fees?: BigNumber;
  match?: BigNumber;
  saved?: BigNumber;
  intentionType?: string;
  account?: string;
  asset1?: string;
  asset2?: string;
  amount?: string;
  amountSoldBought?: string;
  errorDetails?: string;
};

export type SuccessEventData = {
  section: string;
  method: string;
  dispatchInfo?: any;
  data?: TransactionDetails;
};
