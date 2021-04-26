import { HydraApiPromise } from '../../src/types';
import { KeyringPair } from '@polkadot/keyring/types';

export const setBalance = (api: HydraApiPromise, sourceKeyring: KeyringPair, freeAmount: string, reservedAmount: string) => {
  return new Promise<void>(async (resolve, reject) => {
    const unsub = await api.tx.balances
      .setBalance(sourceKeyring.address, freeAmount, reservedAmount)
      .signAndSend(sourceKeyring, async ({ events = [], status }) => {
        if (status.isFinalized) {
          events.forEach(({ event: { data, method, section }, phase }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          });

          unsub();
          resolve();
        }
    });
  });
}