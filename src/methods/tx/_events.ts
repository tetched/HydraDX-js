import {
  ChainBlockEventsCallback,
  ExchangeTxEventData,
  MergedPairedEvents,
} from '../../types';
import { getHdxEventEmitter } from '../../utils/eventEmitter';
import BigNumber from 'bignumber.js';

// export interface ExtrinsicStatus extends Enum {
//   readonly isFuture: boolean;
//   readonly isReady: boolean;
//   readonly isBroadcast: boolean;
//   readonly asBroadcast: Vec<Text>;
//   readonly isInBlock: boolean;
//   readonly asInBlock: Hash;
//   readonly isRetracted: boolean;
//   readonly asRetracted: Hash;
//   readonly isFinalityTimeout: boolean;
//   readonly asFinalityTimeout: Hash;
//   readonly isFinalized: boolean;
//   readonly asFinalized: Hash;
//   readonly isUsurped: boolean;
//   readonly asUsurped: Hash;
//   readonly isDropped: boolean;
//   readonly isInvalid: boolean;
// }

let mergedPairedEvents: MergedPairedEvents = {};

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
//   // TODO set/clear tmp storage with tx-s merged by intentionID
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
//        *                     [User1 acc id, User1 acc id, intention id 1, intention id 2, amount 1, amount 2]
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

// const getExchangeTransactionDetailsTpl = (): ExchangeTransactionDetails => {
//   return {
//     id: null,
//     slippage: new BigNumber(0),
//     fees: new BigNumber(0),
//     match: new BigNumber(0),
//     saved: new BigNumber(0),
//     intentionType: '',
//     account: '',
//     asset1: '',
//     asset2: '',
//     amount: new BigNumber(0),
//     amountSoldBought: new BigNumber(0),
//   };
// };

const mergeEventToScope = (receivedEventData: any) => {
  const intentionId = receivedEventData.data.id;
  let pairedEventData = mergedPairedEvents[intentionId];

  const getMergeStatus = () => {
    const { status } = pairedEventData;

    /**
     * Status property can be changed only to true.
     */
    return {
      ready: receivedEventData.status.ready || status!.ready,
      inBlock: receivedEventData.status.inBlock || status!.inBlock,
      finalized: receivedEventData.status.finalized || status!.finalized,
      error: [...status!.error, ...receivedEventData.status.error],
    };
  };

  if (pairedEventData === undefined) {
    pairedEventData = receivedEventData;
  } else {
    pairedEventData = {
      dispatchInfo: [
        ...(pairedEventData.dispatchInfo || []),
        ...(receivedEventData.dispatchInfo || []),
      ],
      section: [...pairedEventData.section, ...receivedEventData.section],
      method: [...pairedEventData.method, ...receivedEventData.method],
      status: getMergeStatus(),
      data: {
        ...pairedEventData.data,
        ...receivedEventData.data,
        directTrades: [
          ...(pairedEventData.data.directTrades || []),
          ...(receivedEventData.data.directTrades || []),
        ],
      },
    };
  }

  /**
   * Transaction values calculations
   */

  /**
   * Calculate "match" value - total amount, which has been traded by Direct trade
   */
  if (
    receivedEventData.method[0] === 'IntentionResolvedDirectTrade' &&
    pairedEventData.data !== undefined &&
    pairedEventData.data.directTrades !== undefined
  ) {
    let totalDirectTradeMatch = new BigNumber(0);
    pairedEventData.data.directTrades.forEach(item => {
      totalDirectTradeMatch = totalDirectTradeMatch.plus(item.amountReceived);
    });
    pairedEventData.data.match = totalDirectTradeMatch;
  }

  // TODO return final trade price and final trade fee

  /**
   * Calculate "totalAmountFinal" - total amount from all types of trading for
   * this specific exchange action + fees.
   */

  const totalAmmTradeAmount: BigNumber =
    pairedEventData.data && pairedEventData.data.amountOutAmmTrade !== undefined
      ? pairedEventData.data.amountOutAmmTrade
      : new BigNumber(0);

  const totalDirectTradeAmount: BigNumber =
    pairedEventData.data && pairedEventData.data.match !== undefined
      ? pairedEventData.data.match
      : new BigNumber(0);

  const totalFeesAmount: BigNumber =
    pairedEventData.data && pairedEventData.data.fees !== undefined
      ? pairedEventData.data.fees
      : new BigNumber(0);

  if (!pairedEventData.data) pairedEventData.data = { id: null };

  pairedEventData.data.totalAmountFinal = totalAmmTradeAmount
    .plus(totalDirectTradeAmount)
    .plus(totalFeesAmount);

  mergedPairedEvents[intentionId] = pairedEventData;
};

export const processChainEvent = (
  records: any,
  eventCallback: ChainBlockEventsCallback
) => {
  if (!records) return;
  const hdxEventEmitter = getHdxEventEmitter();
  mergedPairedEvents = {}; // set/clear tmp storage with tx-s merged by intentionID

  // const newEvents = records.filter(({ event }: { event: any }) =>
  //   [
  //     'IntentionRegistered',
  //     'IntentionResolvedAMMTrade',
  //     'IntentionResolvedDirectTrade',
  //     'IntentionResolvedDirectTradeFees',
  //     'IntentionResolveErrorEvent',
  //   ].includes(event.method)
  // );

  records.forEach((eventRecord: any) => {
    if (!eventRecord.event) {
      return;
    }

    const { event, phase } = eventRecord;
    const { data, method, section } = event;

    const [dispatchInfo] = data;
    let exchangeTxEventData: ExchangeTxEventData = {
      section: [section],
      method: [method],
      dispatchInfo: [dispatchInfo.toString()],
      status: {
        ready: phase === 'isReady',
        inBlock: phase === 'isInBlock',
        finalized: phase === 'isFinalized',
        error: [],
      },
      data: {
        id: null,
      },
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
            ...exchangeTxEventData,
            data: {
              id: parsedData[5]?.toString(),
              intentionType: parsedData[4]?.toString(),
              account: parsedData[0]?.toString(),
              asset1: parsedData[1]?.toString(),
              asset2: parsedData[2]?.toString(),
              amount: new BigNumber(parsedData[3]?.toString() || 0),
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
            ...exchangeTxEventData,
            data: {
              id: parsedData[2]?.toString(),
              intentionType: parsedData[1]?.toString(),
              account: parsedData[0]?.toString(),
              amountAmmTrade: new BigNumber(parsedData[3]?.toString() || 0),
              amountOutAmmTrade: new BigNumber(parsedData[4]?.toString() || 0),
            },
          });
        }
        break;
      case 'IntentionResolvedDirectTrade':
        /**
         * parsedData: <Array> [AccountId, AccountId, IntentionID, IntentionID, Balance, Balance]
         *                     [User1 acc id, User2 acc id, intention id 1, intention id 2, amount 1, amount 2]
         *
         * First amount is amount of asset A going from first account to second account,
         * and the second amount is asset B going from second account to first account.
         *
         * Which assets have been used - check in event "IntentionRegistered" by
         * appropriate IntentionID.
         *
         * One exchange action (sell/buy) can includes multiple direct trade transactions,
         * that's why we need track all direct trade transactions for one exchange action.
         */
        if (Array.isArray(parsedData)) {
          mergeEventToScope({
            ...exchangeTxEventData,
            intentions: [parsedData[2]?.toString(), parsedData[3]?.toString()],
            data: {
              id: parsedData[2]?.toString(),
              directTrades: [
                {
                  amountSent: new BigNumber(parsedData[4]?.toString() || 0),
                  amountReceived: new BigNumber(parsedData[5]?.toString() || 0),
                  account1: parsedData[0]?.toString(),
                  account2: parsedData[1]?.toString(),
                  pairedIntention: parsedData[3]?.toString(),
                },
              ],
            },
          });
          mergeEventToScope({
            ...exchangeTxEventData,
            intentions: [parsedData[2]?.toString(), parsedData[3]?.toString()],
            data: {
              id: parsedData[3]?.toString(),
              directTrades: [
                {
                  amountSent: new BigNumber(parsedData[5]?.toString() || 0),
                  amountReceived: new BigNumber(parsedData[4]?.toString() || 0),
                  account1: parsedData[1]?.toString(),
                  account2: parsedData[0]?.toString(),
                  pairedIntention: parsedData[2]?.toString(),
                },
              ],
            },
          });
        }
        break;
      case 'IntentionResolvedDirectTradeFees':
        /**
         * parsedData: <Array> [AccountId, AccountId, AssetId, Balance]
         *                     [who, account paid to, asset, fee amount]
         */
        break;
      case 'IntentionResolveErrorEvent':
        /**
         * parsedData: <Array> [AccountId, AssetPair, IntentionType, IntentionId, dispatch]
         *                     [who, assets, sell or buy, intention id, error detail]
         */
        if (Array.isArray(parsedData)) {
          mergeEventToScope({
            ...exchangeTxEventData,
            status: {
              ...exchangeTxEventData.status,
              error: [
                {
                  method,
                  data,
                },
              ],
            },
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
  hdxEventEmitter.emit('onSystemEventProcessed', mergedPairedEvents);

  /**
   * Send paired events data for subscribed for all system events UI listener
   */
  eventCallback(mergedPairedEvents);
};

export const processExchangeTransactionEvent = (events: any) => {
  return new Promise((resolve, reject): void => {
    let currentTxIntentionId: string = '';
    let errorData: any = null;
    const hdxEventEmitter = getHdxEventEmitter();

    events.forEach((eventRecord: any) => {
      console.log('SDK -------');
      console.log('SDK eventRecord - ', eventRecord);
      if (!eventRecord.event) {
        return;
      }

      const { data, method } = eventRecord.event;

      console.log('SDK method - ', method);


      const parsedData = data.toJSON();

      console.log('SDK parsedData - ', parsedData);


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

      if (method === 'ExtrinsicFailed') {
        errorData = data; //TODO add error data processing
      }
    });

    if (errorData) {
      reject(errorData);
      return; // Terminate execution "processExchangeTransactionEvent" function here.
    }
    console.log('SDK currentTxIntentionId - ', currentTxIntentionId);


    //TODO wait for data from system.events
    if (!currentTxIntentionId || currentTxIntentionId.length === 0) {
      reject(new Error('Intention ID has not been found in exchange even data.'));
      return; // Terminate execution "processExchangeTransactionEvent" function here.
    }

    //TODO check all required fields in tx data
    if (mergedPairedEvents[currentTxIntentionId] !== undefined) {
      resolve(mergedPairedEvents[currentTxIntentionId]);
      return; // Terminate execution "processExchangeTransactionEvent" function here.
    }

    const checkPairedTxData = (systemEventPairedData: MergedPairedEvents) => {
      //TODO check all required fields in tx data
      if (systemEventPairedData[currentTxIntentionId] !== undefined) {
        resolve(systemEventPairedData[currentTxIntentionId]);

        hdxEventEmitter.removeListener(
          'onSystemEventProcessed',
          checkPairedTxData
        );
        return;
      }
    };

    hdxEventEmitter.on('onSystemEventProcessed', checkPairedTxData);
  });

  // TODO add reject processing
};
