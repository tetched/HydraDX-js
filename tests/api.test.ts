import Api from '../src/api';
import { HydraApiPromise } from '../src/types';
import { getAliceAccount } from './utils/getAliceAccount';

let api: HydraApiPromise;
let aliceAccount: string;

test('API object should be undefined at first', () => {
  api = Api.getApi();
  expect(api).toBe(undefined);
});

it('API object should be defined after initialize', async () => {
  api = await Api.initialize({}, process.env.WS_URL);
  aliceAccount = getAliceAccount().address;
  expect(api).toBeDefined();
});

test('Test getAccountBalances', async () => {
  const accountBalances = await api.hydraDx.query.getAccountBalances(aliceAccount);
  expect(accountBalances).toBeDefined();
});

test('Test getAssetList', async () => {
  const assetList = await api.hydraDx.query.getAssetList(aliceAccount);
  expect(assetList).toBeDefined();
});

test('Test getPoolInfo', async () => {
  const poolInfo = await api.hydraDx.query.getPoolInfo(aliceAccount);
  expect(poolInfo).toBeDefined();
});

test('Test getSpotPrice', async () => {
  const spotPrice = await api.hydraDx.query.getSpotPrice('1000', '2000', '500');
  expect(spotPrice).toBeDefined();
});

test('Test getTradePrice', async () => {
  const tradePrice = await api.hydraDx.query.getTradePrice('1000', '2000', '500', 'sell');
  expect(tradePrice).toBeDefined();
});
