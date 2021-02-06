import { ApiPromise, WsProvider } from '@polkadot/api';
import { Signer } from '@polkadot/api/types';
import {
  web3Enable,
  web3AccountsSubscribe,
  web3FromAddress,
} from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ApiListeners } from './types';

import * as query from './api/query';
import * as tx from './api/tx';

interface HydraApiPromise extends ApiPromise {
  hydraDx?: any,
}

let api: HydraApiPromise;

const getApi = (): HydraApiPromise => {
  return api;
};

const getSinger = async (account: string): Promise<Signer> => {
  const injector = await web3FromAddress(account);
  return injector.signer;
};

const syncWallets = async (
  updateFunction: (accounts: InjectedAccountWithMeta[]) => void
): Promise<null> => {
  // returns an array of all the injected sources
  // (this needs to be called first, before other requests)
  const allInjected = await web3Enable('HACK.HydraDX.io');

  if (!allInjected.length) {
    return null;
  } else {
    web3AccountsSubscribe(updateFunction);
    return null;
  }
};

const initialize = async (apiListeners?: ApiListeners, apiUrl?: string, maxRetries: number = 20): Promise<HydraApiPromise> => {
  return new Promise<any>(async (resolve, reject) => {
    const local =
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'localhost';

    const serverAddress = local
      ? 'ws://127.0.0.1:9944'
      : (apiUrl || 'wss://hack.hydradx.io:9944');

    const wsProvider = new WsProvider(serverAddress, false);
    let reconnectionsIndex = 0;
    let isDisconnection  = false;

    /**
     * Recovering connection to WS. Will be done "reconnectionsNumber" attempts.
     * If connection is not recovered, API listener "error" will be executed.
     */
    const recoverConnection = (error: Error) => {
      if (reconnectionsIndex < maxRetries) {
        setTimeout(() => {
          wsProvider.connect();
          reconnectionsIndex++;
          console.log(`Reconnection - #${reconnectionsIndex}`);
        }, 500);
      } else {
        reconnectionsIndex = 0;
        if (apiListeners) {
          apiListeners.error(error);
        }
      }
    };

    /**
     * We need setup websocket listeners "on" before running connection.
     */

    wsProvider.on('error', async error => {
      console.log('AAA');
      recoverConnection(error);
    });

    wsProvider.on('connected', async () => {
      if (api) return api;
  
      await new ApiPromise({
        provider: wsProvider,
        rpc: {
          amm: {
            getSpotPrice: {
              description: 'Get spot price',
              params: [
                {
                  name: 'asset1',
                  type: 'AssetId',
                },
                {
                  name: 'asset2',
                  type: 'AssetId',
                },
                {
                  name: 'amount',
                  type: 'Balance',
                },
              ],
              type: 'BalanceInfo',
            },
            getSellPrice: {
              description: 'Get AMM sell price',
              params: [
                {
                  name: 'asset1',
                  type: 'AssetId',
                },
                {
                  name: 'asset2',
                  type: 'AssetId',
                },
                {
                  name: 'amount',
                  type: 'Balance',
                },
              ],
              type: 'BalanceInfo',
            },
            getBuyPrice: {
              description: 'Get AMM buy price',
              params: [
                {
                  name: 'asset1',
                  type: 'AssetId',
                },
                {
                  name: 'asset2',
                  type: 'AssetId',
                },
                {
                  name: 'amount',
                  type: 'Balance',
                },
              ],
              type: 'BalanceInfo',
            },
          },
        },
        types: {
          Amount: 'i128',
          AmountOf: 'Amount',
          Address: 'AccountId',
          LookupSource: 'AccountId',
          CurrencyId: 'AssetId',
          CurrencyIdOf: 'AssetId',
          BalanceInfo: {
            amount: 'Balance',
            assetId: 'AssetId',
          },
          IntentionID: 'Hash',
          IntentionType: {
            _enum: ['SELL', 'BUY'],
          },
          Intention: {
            who: 'AccountId',
            asset_sell: 'AssetId',
            asset_buy: 'AssetId',
            amount_sell: 'Balance',
            amount_buy: 'Balance',
            trade_limit: 'Balance',
            discount: 'bool',
            sell_or_buy: 'IntentionType',
            intention_id: 'IntentionID',
          },
          Price: 'Balance',
        },
      })
        .on('error', e => {
          if (!isDisconnection) {
            if (apiListeners) {
              apiListeners.error(e);
            }
            reject(e);
          }
        })
        .on('connected', () => {
          if (apiListeners) {
            apiListeners.connected();
          }
          resolve('connected');
          isDisconnection = false;
        })
        .on('disconnected', () => {
          /**
           * This event happens when connection has been lost and each time, when
           * connection attempt has been done with error.
           */
          if (!isDisconnection) {
            if (apiListeners) {
              apiListeners.disconnected();
            }
            reject();
            isDisconnection = true;
            wsProvider.connect();
          }
        })
        .on('ready', apiInstance => {
          api = apiInstance;
          api.hydraDx = {
            query,
            tx
          };
          if (apiListeners) {
            apiListeners.ready(api);
          }
          resolve(api);
        })
        .isReadyOrError.then(apiResponse => {
          api = apiResponse;
          api.hydraDx = {
            query,
            tx
          };
          if (apiListeners) {
            apiListeners.connected(api);
          }
          resolve(api);
        })
        .catch(e => {
          if (apiListeners) {
            apiListeners.error(e); 
          }
          reject(e);
        });
    });

    wsProvider.connect();
  });
};

export default {
  initialize,
  syncWallets,
  getApi,
  getSinger,
};
