import Api from '../../api';
import { processTradeTransactionEvent } from './_events';
import { ChainEventCallback, TradeTransaction } from '../../types';
import { getHdxEventEmitter } from './../../utils/eventEmitter';

export const txCallback = (
  resolve: any,
  reject: any,
  methodName?: string
) => ({ dispatchError, dispatchInfo, events, status }: any) => {
  const api = Api.getApi();
  const hdxEventEmitter = getHdxEventEmitter();

  // like this
  // apiInst.query.system.events((events: any) => {
  //   processChainEvent({ events })
  // });
  // eventEmitter
  // here you need as soon as you call swap fn you need start listen global chain events
  // and when I find intention ID I'll pair IDs from global event and from "events" data above
  // and only after that send response to user

  // also we need global listener with tmp storage and pair all transactions

  // if (tradeTransaction !== undefined && eventCallback !== undefined)
  //   processChainEvent({ events, status, tradeTransaction }, eventCallback, resolve, reject);

  if (methodName === 'exchange') {
    hdxEventEmitter.on('systemEvent', () => processTradeTransactionEvent(events, resolve, reject))
  } else {
    if (status.isInBlock) {
      const successEvents: any[] = [];
      const errorEvents: any[] = [];

      events.forEach((event: any) => {
        if (api.events.system.ExtrinsicSuccess.is(event.event)) {
          successEvents.push(event);
        } else if (api.events.system.ExtrinsicFailed.is(event.event)) {
          errorEvents.push(event);
        }
      });

      if (errorEvents.length) {
        const errorData = errorEvents.map(({ event }) => {
          const [dispatchError, dispatchInfo] = event.data;
          let errorInfo;

          if (dispatchError.isModule) {
            const { documentation, section, name } = api.registry.findMetaError(
              dispatchError.asModule
            );

            errorInfo = {
              section,
              name,
              documentation: documentation.join(' '),
            };
          } else {
            errorInfo = dispatchError.toString();
          }

          return errorInfo;
        });

        reject({
          type: 'ExtrinsicFailed',
          data: errorData,
        });
      } else {
        const successData = (successEvents.length > 0
            ? successEvents
            : events
        ).map(({ event: { section, method, data } }: any) => {
          const [dispatchInfo] = data;

          return {
            section,
            method,
            dispatchInfo: dispatchInfo.toString(),
          };
        });

        resolve({
          data: successData,
        });
      }
    }
  }

};

export const txCatch = (reject: any) => (error: any) => {
  reject({
    type: 'Error',
    data: error.message,
  });
};
