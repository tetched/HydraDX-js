import Api from '../../api';
import { bnToBn, formatBalance } from "@polkadot/util";
import BN from 'bn.js';
import BigNumber from 'bignumber.js';

function addLiquidity(asset1Id: string, asset2Id: string, amount: BN, maxSellPrice: BigNumber) {
  const api = Api.getApi();

  return api.tx.amm
                .addLiquidity(
                  asset1Id,
                  asset2Id,
                  bnToBn(amount.toString()),
                  bnToBn(maxSellPrice.toString())
                );
};

function removeLiquidity(asset1Id: string, asset2Id: string, liquidityToRemove: BigNumber) {
  const api = Api.getApi();

  return api.tx.amm
                .removeLiquidity(
                  asset1Id,
                  asset2Id,
                  bnToBn(liquidityToRemove.toString())
                );
};

function createPool(asset1Id: string, asset2Id: string, amount: BigNumber, initialPrice: BigNumber) {
  const api = Api.getApi();

  return api.tx.amm
                .createPool(
                  asset1Id,
                  asset2Id,
                  bnToBn(amount.toString()),
                  bnToBn(initialPrice.toString())
                );
};

export {
  addLiquidity,
  removeLiquidity,
  createPool,
}