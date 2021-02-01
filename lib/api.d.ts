import { ApiPromise } from '@polkadot/api';
import { Signer } from '@polkadot/api/types';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
interface HydraApiPromise extends ApiPromise {
    hydraDx?: any;
}
declare const _default: {
    initialize: (apiUrl?: string | undefined) => Promise<HydraApiPromise>;
    syncWallets: (updateFunction: (accounts: InjectedAccountWithMeta[]) => void) => Promise<null>;
    getApi: () => HydraApiPromise;
    getSinger: (account: string) => Promise<Signer>;
};
export default _default;
