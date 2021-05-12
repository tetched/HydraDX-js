import {
  ChainEventCallback,
  TradeTransaction,
  ChainEventResponse,
  SuccessEventData,
} from '../../types';
import BigNumber from 'bignumber.js';
import Api from '../../api';

let mergedPairedEvents: { [key: string]: SuccessEventData } = {};

// const decorateTxEventResponseData = (
//   eventData: {
//     id: number | null;
//     progress: number;
//   },
//   tradeTransaction: TradeTransaction | null = null
// ): ChainEventResponse => {
//   let decoratedTransactionData: ChainEventResponse = {
//     id: eventData.id,
//     progress: eventData.progress,
//   };
//
//   if (eventData.id != null) {
//     if (tradeTransaction !== null) {
//       decoratedTransactionData = {
//         ...decoratedTransactionData,
//         slippage: tradeTransaction.slippage,
//         fees: new BigNumber(0),
//         match: new BigNumber(0),
//         saved: new BigNumber(0),
//       };
//     }
//
//     /**
//      * We could get unsorted transaction data the progress should always be
//      * the highest (errors being 4 and 5)
//      */
//     const progress = Math.max(
//       transaction.progress,
//       transactionData?.progress || 0,
//       state.transactions[transaction.id]?.progress || 0
//     );
//
//     transactionData = {
//       ...transactionData,
//       ...state.transactions[transaction.id],
//       ...transaction,
//       progress,
//     };
//   } else if (transaction.index != null) {
//     state.unpairedTransactions = {
//       ...state.unpairedTransactions,
//       [transaction.index]: {
//         ...state.unpairedTransactions[transaction.index],
//         ...transaction,
//       },
//     };
//   }
//
//   return decoratedTransactionData;
// };

// export const processChainEvent = (
//   transactionData: {
//     events: any;
//     status?: any;
//     tradeTransaction?: TradeTransaction;
//   },
//   eventCallback: ChainEventCallback,
//   resolve?: any,
//   reject?: any
// ) => {
//   const { events, status, tradeTransaction } = transactionData;
//   const api = Api.getApi();
//
//   if (!events) return;
//
//   // TODO set/clear tmp storage with tx-s merged by intenssionID
//
//   if (status.isInBlock) {
//     const successEvents: any[] = [];
//     const errorEvents: any[] = [];
//
//     events.forEach((event: any) => {
//       if (api.events.system.ExtrinsicSuccess.is(event.event)) {
//         successEvents.push(event);
//       } else if (api.events.system.ExtrinsicFailed.is(event.event)) {
//         errorEvents.push(event);
//       }
//     });
//
//     if (errorEvents.length) {
//       const errorData = errorEvents.map(({ event }) => {
//         const { method, data } = event;
//         const [dispatchError, dispatchInfo] = data;
//         let errorInfo;
//
//         if (dispatchError.isModule) {
//           const { documentation, section, name } = api.registry.findMetaError(
//             dispatchError.asModule
//           );
//
//           errorInfo = {
//             section,
//             name,
//             documentation: documentation.join(' '),
//             txData: decorateTxEventResponseData(
//               { progress: 4, id: Math.random() },
//               tradeTransaction
//             ),
//           };
//         } else {
//           // TODO add tx data
//           errorInfo = dispatchError.toString();
//         }
//
//         return errorInfo;
//       });
//
//       if (reject) {
//         reject({
//           type: 'ExtrinsicFailed',
//           data: errorData,
//         });
//       } else {
//         eventCallback({
//           type: 'ExtrinsicFailed',
//           data: errorData,
//         });
//       }
//     } else {
//       const successDataList = (successEvents.length > 0
//         ? successEvents
//         : events
//       ).map(({ event: { section, method, data } }: any) => {
//         const [dispatchInfo] = data;
//         let successData: SuccessEventData = {
//           section,
//           method,
//           dispatchInfo: dispatchInfo.toString(),
//         };
//
//         if (method === 'IntentionRegistered') {
//           const parsedData = data.toJSON();
//           /**
//            * parsedData: <Array> [AccountId, AssetId, AssetId, Balance, IntentionType, IntentionID]
//            *                     [who, asset a, asset b, amount, intention type, intention id]
//            */
//           if (Array.isArray(parsedData) && parsedData.length === 6) {
//             const id = parsedData[5]?.toString();
//
//             successData = {
//               ...successData,
//               txData: decorateTxEventResponseData(
//                 { progress: 2, id },
//                 tradeTransaction
//               ),
//             };
//           }
//         }
//
//         return successData;
//       });
//
//       if (resolve) {
//         resolve({
//           data: successDataList,
//         });
//       } else {
//         eventCallback({
//           data: successDataList,
//         });
//       }
//     }
//   }
//
//   events.forEach((eventRecord: any) => {
//     if (!eventRecord.event) {
//       return;
//     }
//
//     const { data, method, section } = eventRecord.event;
//
//     const [dispatchInfo] = data;
//     let successData: SuccessEventData = {
//       section,
//       method,
//       dispatchInfo: dispatchInfo.toString(),
//     };
//
//     // if (method === 'IntentionRegistered' && status && status.isInBlock) {
//     //   const parsedData = data.toJSON();
//     //   /**
//     //    * parsedData: <Array> [AccountId, AssetId, AssetId, Balance, IntentionType, IntentionID]
//     //    *                     [who, asset a, asset b, amount, intention type, intention id]
//     //    */
//     //   if (Array.isArray(parsedData) && parsedData.length === 6) {
//     //     const id = parsedData[5]?.toString();
//     //     eventCallback({
//     //       id: id,
//     //       index: currentIndex,
//     //       progress: 2,
//     //     });
//     //   }
//     // }
//     // if (
//     //   method === 'ExtrinsicFailed' &&
//     //   currentIndex != null &&
//     //   status?.isInBlock
//     // ) {
//     //   eventCallback({
//     //     id: Math.random().toString(),
//     //     index: currentIndex,
//     //     progress: 4,
//     //   });
//     // }
//     if (method === 'IntentionResolvedAMMTrade') {
//       const parsedData = data.toJSON();
//       /**
//        * parsedData: <Array> [AccountId, IntentionType, IntentionID, Balance, Balance]
//        *                     [who, intention type, intention id, amount, amount sold/bought]
//        */
//       if (Array.isArray(parsedData)) {
//         const id = parsedData[2]?.toString();
//         eventCallback({
//           ...successData,
//           txData: decorateTxEventResponseData(
//             { progress: 3, id },
//             tradeTransaction
//           ),
//         });
//       }
//     }
//     if (method === 'IntentionResolvedDirectTrade') {
//       //TODO: add amounts matched
//       const parsedData = data.toJSON();
//       /**
//        * parsedData: <Array> [AccountId, AccountId, IntentionID, IntentionID, Balance, Balance]
//        *                     [User1 accid, User1 accid, intention id 1, intention id 2, amount 1, amount 2]
//        */
//
//       if (Array.isArray(parsedData)) {
//         eventCallback({
//           id: parsedData[3]?.toString(),
//           progress: 3,
//         });
//         eventCallback({
//           id: parsedData[4]?.toString(),
//           progress: 3,
//         });
//       }
//     }
//
//     if (method === 'IntentionResolveErrorEvent') {
//       const parsedData = data.toJSON();
//       /**
//        * parsedData: <Array> [AccountId, AssetPair, IntentionType, IntentionId, dispatch]
//        *                     [who, assets, sell or buy, intention id, error detail]
//        */
//       // TODO add error msg to response obj
//
//       if (Array.isArray(parsedData)) {
//         eventCallback({
//           id: parsedData[3]?.toString(),
//           progress: 5,
//         });
//       }
//     }
//   });
//
//   //TODO send data
// };

const mergeEventToScope = (eventData: any) => {
  const intentionId = eventData.data.id;

  if (mergedPairedEvents[intentionId] === undefined) {
    mergedPairedEvents[intentionId] = eventData;
  } else {
    //TODO here should be added calculation for different types of transactions
    mergedPairedEvents[intentionId] = {
      ...mergedPairedEvents[intentionId],
      method: mergedPairedEvents[intentionId].push(eventData.method),
      status: {}, // TODO process status value - merge
      data: {
        ...mergedPairedEvents[intentionId].data,
        ...eventData.data,
      },
    };
  }
};

export const processChainEvent = (
  records: any,
  eventCallback: ChainEventCallback
) => {
  if (!records) return;

  mergedPairedEvents = {}; // TODO set/clear tmp storage with tx-s merged by intenssionID

  const newEvents = records.filter(({ event }: { event: any }) =>
    [
      'IntentionRegistered',
      'IntentionResolvedAMMTrade',
      'IntentionResolvedDirectTrade',
      'IntentionResolvedDirectTradeFees',
      'IntentionResolveErrorEvent',
    ].includes(event.method)
  );

  newEvents.forEach((eventRecord: any) => {
    if (!eventRecord.event) {
      return;
    }

    const { event, phase } = eventRecord;
    const { data, method, section } = event;

    const [dispatchInfo] = data;
    let successData: SuccessEventData = {
      section,
      method,
      dispatchInfo: dispatchInfo.toString(),
    };

    const parsedData = data.toJSON();

    switch (method) {
      case 'IntentionRegistered':
        /**
         * parsedData: <Array> [AccountId, AssetId, AssetId, Balance, IntentionType, IntentionID]
         *                     [who, asset a, asset b, amount, intention type, intention id]
         */
        if (Array.isArray(parsedData) && parsedData.length === 6) {
          mergeEventToScope({
            ...successData,
            status: {
              ready: phase === 'isReady',
              inBlock: phase === 'isInBlock',
              finalized: false, //TODO complete
              error: [], // array of objects { methodName, errorObjectFromApi }
            },
            data: {
              id: parsedData[5]?.toString(),
              intentionType: parsedData[4]?.toString(),
              account: parsedData[0]?.toString(),
              asset1: parsedData[1]?.toString(),
              asset2: parsedData[2]?.toString(),
              amount: parsedData[3]?.toString(),
            },
          });
        }
        break;
      case 'IntentionResolvedAMMTrade':
        /**
         * parsedData: <Array> [AccountId, IntentionType, IntentionID, Balance, Balance]
         *                     [who, intention type, intention id, amount, amount sold/bought]
         */
        if (Array.isArray(parsedData)) {
          mergeEventToScope({
            ...successData,
            data: {
              id: parsedData[2]?.toString(),
              intentionType: parsedData[1]?.toString(),
              account: parsedData[0]?.toString(),
              amount: parsedData[3]?.toString(),
              amountSoldBought: parsedData[4]?.toString(),
            },
          });
        }
        break;
      case 'IntentionResolvedDirectTrade':
        /**
         * parsedData: <Array> [AccountId, AccountId, IntentionID, IntentionID, Balance, Balance]
         *                     [User1 accid, User2 accid, intention id 1, intention id 2, amount 1, amount 2]
         */
        if (Array.isArray(parsedData)) {
          mergeEventToScope({
            ...successData,
            data: {
              id: parsedData[2]?.toString(),
              account: parsedData[0]?.toString(),
              amount: parsedData[4]?.toString(),
            },
          });
          mergeEventToScope({
            ...successData,
            data: {
              id: parsedData[3]?.toString(),
              account: parsedData[1]?.toString(),
              amount: parsedData[5]?.toString(),
            },
          });
        }
        break;
      case 'IntentionResolvedDirectTradeFees':
        /**
         * parsedData: <Array> [AccountId, AccountId, AssetId, Balance]
         *                     [User1 accid, User2 accid, assetId, amount]
         */
        break;
      case 'IntentionResolveErrorEvent':
        /**
         * parsedData: <Array> [AccountId, AssetPair, IntentionType, IntentionId, dispatch]
         *                     [who, assets, sell or buy, intention id, error detail]
         */
        if (Array.isArray(parsedData)) {
          mergeEventToScope({
            ...successData,
            data: {
              id: parsedData[3]?.toString(),
              account: parsedData[0]?.toString(),
              intentionType: parsedData[2]?.toString(),
              assetsPair: parsedData[1]?.toString(),
              errorDetails: parsedData[1]?.toString(),
            },
          });
        }
        break;
    }
  });

  /**
   * If "mergedPairedEvents" contains any error, we need reject with failed tx data.
   */

  eventCallback(mergedPairedEvents); //TODO send data
};

export const processTradeTransactionEvent = (
  events: any,
  resolve: any,
  reject: any
) => {
  let currentTxIntentionId: string = '';
  let errorData: any = null;

  events.forEach((eventRecord: any) => {
    if (!eventRecord.event) {
      return;
    }

    const { data, method, section } = eventRecord.event;

    const parsedData = data.toJSON();

    /**
     * parsedData: <Array> [AccountId, AssetId, AssetId, Balance, IntentionType, IntentionID]
     *                     [who, asset a, asset b, amount, intention type, intention id]
     */
    if (
      method === 'IntentionRegistered' &&
      Array.isArray(parsedData) &&
      parsedData.length === 6
    ) {
      currentTxIntentionId = parsedData[5].toString();
    }

    if (
      method === 'ExtrinsicFailed'
    ) {
      errorData = data; //TODO add error data processing
    }
  });

  if (errorData) {
    reject(errorData);
  }

  //TODO wait for data from system.events
  if (
    currentTxIntentionId &&
    currentTxIntentionId.length > 0 &&
    mergedPairedEvents[currentTxIntentionId] !== undefined
    //TODO add check is all required fields in tx data existing and filled
  ) {
    resolve(mergedPairedEvents[currentTxIntentionId]);
  }

  // TODO add reject processing
};
