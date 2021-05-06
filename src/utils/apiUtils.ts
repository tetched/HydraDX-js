export const processChainEvent = (
    transactionData: { events: any; currentIndex?: number; status?: any },
    eventCallback: ({
        id,
        index,
        progress,
    }: {
        id: string;
        index?: number;
        progress: number;
    }) => void
) => {
    const { events, currentIndex, status } = transactionData;

    if (!events) return;

    events.forEach((eventRecord: any) => {
        if (!eventRecord.event) {
            return;
        }

        const { data, method } = eventRecord.event;

        if (method === 'IntentionRegistered' && status && status.isInBlock) {
            const parsedData = data.toJSON();
            /**
             * parsedData: <Array> [AccountId, AssetId, AssetId, Balance, IntentionType, IntentionID]
             *                     [who, asset a, asset b, amount, intention type, intention id]
             */
            if (Array.isArray(parsedData) && parsedData.length === 6) {
                const id = parsedData[5]?.toString();
                eventCallback({
                    id: id,
                    index: currentIndex,
                    progress: 2,
                });
            }
        }
        if (
            method === 'ExtrinsicFailed' &&
            currentIndex != null &&
            status?.isInBlock
        ) {
            eventCallback({
                id: Math.random().toString(),
                index: currentIndex,
                progress: 4,
            });
        }
        if (method === 'IntentionResolvedAMMTrade') {
            const parsedData = data.toJSON();
            /**
             * parsedData: <Array> [AccountId, IntentionType, IntentionID, Balance, Balance]
             *                     [who, intention type, intention id, amount, amount sold/bought]
             */
            if (Array.isArray(parsedData)) {
                const id = parsedData[2]?.toString();
                eventCallback({
                    id: id,
                    progress: 3,
                });
            }
        }
        if (method === 'IntentionResolvedDirectTrade') {
            //TODO: add amounts matched
            const parsedData = data.toJSON();
            /**
             * parsedData: <Array> [AccountId, AccountId, IntentionID, IntentionID, Balance, Balance]
             *                     [User1 accid, User1 accid, intention id 1, intention id 2, amount 1, amount 2]
             */

            if (Array.isArray(parsedData)) {
                eventCallback({
                    id: parsedData[3]?.toString(),
                    progress: 3,
                });
                eventCallback({
                    id: parsedData[4]?.toString(),
                    progress: 3,
                });
            }
        }
    });
};
