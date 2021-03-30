import { HydraApiPromise } from '../../src/types';
import { KeyringPair } from '@polkadot/keyring/types';

export const transfer = (api: HydraApiPromise, targetAddress: string, sourceKeyring: KeyringPair, amount: string) => {
  return new Promise<void>(async (resolve, reject) => {
    const unsub = await api.tx.balances
      .transfer(targetAddress, amount)
      .signAndSend(sourceKeyring, async ({ events = [], status }) => {
        if (status.isFinalized) {
          unsub();
          resolve();
        }
    });
  });
}