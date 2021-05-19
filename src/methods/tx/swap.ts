import Api from '../../api';
import { bnToBn } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { AddressOrPair, Signer } from '@polkadot/api/types';
import { txCallback, txCatch } from './_callback';

export function swap({
  asset1Id,
  asset2Id,
  amount,
  expectedOut,
  actionType,
  slippage = new BigNumber('100000000000000000'),
  account,
  signer,
}: {
  asset1Id: string;
  asset2Id: string;
  amount: BigNumber;
  expectedOut: string;
  actionType: string;
  slippage: BigNumber;
  account: AddressOrPair;
  signer?: Signer;
}) {
  const api = Api.getApi();
  let tx: any;
  let result: any;

  if (actionType === 'buy') {
    tx = api.tx.exchange
      //TODO: CALCULATE LIMITS FROM SPOT PRICE
      .buy(
        asset1Id,
        asset2Id,
        bnToBn(amount.toString()),
        bnToBn(slippage.toString()),
        false
      );
  } else {
    tx = api.tx.exchange
      //TODO: CALCULATE LIMITS FROM SPOT PRICE
      .sell(
        asset1Id,
        asset2Id,
        bnToBn(amount.toString()),
        bnToBn(slippage.toString()),
        false
      );
  }

  return new Promise((resolve, reject) => {
    if (signer) {
      result = tx.signAndSend(
        account,
        { signer },
        txCallback(resolve, reject, 'exchange')
      );
    } else {
      result = tx.signAndSend(
        account,
        txCallback(resolve, reject, 'exchange')
      );
    }

    result.catch(txCatch(reject));
  });
}
