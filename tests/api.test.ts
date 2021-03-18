import Api from '../src/api';
import { HydraApiPromise } from '../src/types';

let api: HydraApiPromise;
let HydraAccount = '5EKq4zjH8skHctyTS5QGaQYQnw3xyPW6cqkAPLPhwiap62DQ';
let assetList;

test('API object should be undefined at first', () => {
  api = Api.getApi();
  expect(api).toBe(undefined);
});

test('API object should be defined after initialize', async () => {
  api = await Api.initialize({}, 'wss://rpc-01.snakenet.hydradx.io');
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
  const spotPrice = await api.hydraDx.query.getSpotPrice('HDX', 'tKSM');
  expect(spotPrice).toBeDefined();
});

test('Test getTradePrice', async () => {
  const tradePrice = await api.hydraDx.query.getTradePrice('HDX', 'tKSM', "100000000", 'sell');
  expect(tradePrice).toBeDefined();
});
