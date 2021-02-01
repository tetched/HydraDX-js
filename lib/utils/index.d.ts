import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { AssetAmount } from '../types';
declare const formatBalanceAmount: (balance: BN) => AssetAmount;
declare const decToBn: (bignumber: BigNumber) => BN;
declare const bnToDec: (bn: BN) => BigNumber;
export { decToBn, bnToDec, formatBalanceAmount };
