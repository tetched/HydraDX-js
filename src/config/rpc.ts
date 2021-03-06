export default {
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
}