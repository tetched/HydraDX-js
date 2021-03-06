import { ApiPromise, WsProvider } from '@polkadot/api';

import { ApiListeners, HydraApiPromise } from './types';
import RpcConfig from './config/rpc';
import TypeConfig from './config/type';

import * as query from './api/query';
import * as tx from './api/tx';

let api: HydraApiPromise;

const getApi = (): HydraApiPromise => api;

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
        rpc: RpcConfig,
        types: TypeConfig,
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
  getApi,
};
