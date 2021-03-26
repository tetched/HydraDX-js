import BigNumber from 'bignumber.js';
import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

import { stringToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';

let api: HydraApiPromise;
let HydraAccount = '5EKq4zjH8skHctyTS5QGaQYQnw3xyPW6cqkAPLPhwiap62DQ';

test('Test getAccountBalances structure', async () => {
  // api = await Api.initialize({}, 'wss://rpc-01.snakenet.hydradx.io');
  api = await Api.initialize({}, process.env.WS_URL);
  
  const accountBalances = await api.hydraDx.query.getAccountBalances(HydraAccount);

  const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
  const alice = keyring.addFromUri('//Alice');
  const target = keyring.addFromUri('//Target');

  let aliceBalance = await api.hydraDx.query.getAccountBalances(alice.address);

  // console.log(aliceBalance);

  // const unsub = await api.tx.balances
  //   .transfer(target.address, 1000000000000000)
  //   .signAndSend(alice, async (result) => {

  //     console.log(`Current status is ${result.status}`);

  //     if (result.status.isInBlock) {
  //       console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  //     } else if (result.status.isFinalized) {
  //       console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);

  //       const targetBalance = await api.hydraDx.query.getAccountBalances(target.address);

  //       console.log(targetBalance);
  //       unsub();
  //     }
  // });

  const targetBalance = await api.hydraDx.query.getAccountBalances(target.address);

  // console.log(targetBalance);

  // console.log(txHash);

  expect(accountBalances).toEqual(
    [{
      assetId: 0,
      balance: new BigNumber('0'),
      balanceFormatted: '0'
    }]
  );
});
