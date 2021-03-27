import Api from '../src/api';
import { HydraApiPromise } from '../src/types';

let api: HydraApiPromise;
let HydraAccount = '5EKq4zjH8skHctyTS5QGaQYQnw3xyPW6cqkAPLPhwiap62DQ';
let assetList;

test('API object should be undefined at first', () => {
  api = Api.getApi();
  expect(api).toBe(undefined);
});

it('API object should be defined after initialize', async () => {
  api = await Api.initialize({}, process.env.WS_URL);
  expect(api).toBeDefined();
});

test('Test getAccountBalances', async () => {
  const accountBalances = await api.hydraDx.query.getAccountBalances(HydraAccount);
  expect(accountBalances).toBeDefined();
});

test('Test getAssetList', async () => {
  assetList = await api.hydraDx.query.getAssetList(HydraAccount);
  expect(assetList).toBeDefined();
});

test('Test getPoolInfo', async () => {
  const poolInfo = await api.hydraDx.query.getPoolInfo(HydraAccount);
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
