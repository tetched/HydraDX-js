import { ApiPromise, WsProvider } from '@polkadot/api';

import { ApiListeners, HydraApiPromise } from './types';
import TypeConfig from './config/type';

import * as query from './methods/query';
import * as tx from './methods/tx';

let api: HydraApiPromise;

const getApi = (): HydraApiPromise => api;

const initialize = async (apiListeners?: ApiListeners, apiUrl: string = 'ws://127.0.0.1:9944', maxRetries: number = 20): Promise<HydraApiPromise> => {
  return new Promise<any>(async (resolve, reject) => {
    const wsProvider = new WsProvider(apiUrl, false);
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
        if (apiListeners && apiListeners.error) {
          apiListeners.error(error);
        }
      }
    };

    /**
     * We need setup websocket listeners "on" before running connection.
     */

    wsProvider.on('error', async error => {
      recoverConnection(error);
    });

    wsProvider.on('connected', async () => {
      if (api) {
        resolve(api);
        return api;
      }
  
      await new ApiPromise({
        provider: wsProvider,
        types: TypeConfig,
        typesAlias: {
          tokens: {
            AccountData: 'OrmlAccountData',
          },
        },
      })
        .on('error', e => {
          if (!isDisconnection) {
            if (apiListeners && apiListeners.error) {
              apiListeners.error(e);
            }
            reject(e);
          }
        })
        .on('connected', () => {
          if (apiListeners && apiListeners.connected) {
            apiListeners.connected();
          }
          // resolve('connected');
          isDisconnection = false;
        })
        .on('disconnected', () => {
          /**
           * This event happens when connection has been lost and each time, when
           * connection attempt has been done with error.
           */
          if (!isDisconnection) {
            if (apiListeners && apiListeners.disconnected) {
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
          if (apiListeners && apiListeners.ready) {
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
          if (apiListeners && apiListeners.connected) {
            apiListeners.connected(api);
          }
          resolve(api);
        })
        .catch(e => {
          if (apiListeners && apiListeners.error) {
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
  getApi,
};
