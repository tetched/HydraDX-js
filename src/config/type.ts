export default {
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
}