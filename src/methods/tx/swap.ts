import Api from '../../api';
import { bnToBn } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { AddressOrPair, Signer } from '@polkadot/api/types';
import { txCallback, txCatch } from './_callback';
import { ChainEventCallback } from '../../types';

export function swap({
  asset1Id,
  asset2Id,
  amount,
  actionType,
  currentIndex,
  account,
  signer,
  eventCallback,
}: {
  asset1Id: string;
  asset2Id: string;
  amount: BigNumber;
  actionType: string;
  currentIndex: number;
  account: AddressOrPair;
  signer?: Signer;
  eventCallback: ChainEventCallback;
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
        bnToBn('100000000000000000'),
        false
      );
  } else {
    tx = api.tx.exchange
      //TODO: CALCULATE LIMITS FROM SPOT PRICE
      .sell(
        asset1Id,
        asset2Id,
        bnToBn(amount.toString()),
        bnToBn('100000000000000000'),
        false
      );
  }

  return new Promise((resolve, reject) => {
    if (signer) {
      result = tx.signAndSend(
        account,
        { signer },
        txCallback(resolve, reject, currentIndex, eventCallback)
      );
    } else {
      result = tx.signAndSend(
        account,
        txCallback(resolve, reject, currentIndex, eventCallback)
      );
    }

    result.catch(txCatch(reject));
  });
}
