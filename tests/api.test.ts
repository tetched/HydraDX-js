import Api from '../src/api';
import { HydraApiPromise } from '../src/types';

test('API object should be undefined at first', () => {
  const api = Api.getApi();
  expect(api).toBe(undefined);
});

test('API object should be defined after initialize', async () => {
  jest.setTimeout(30000);

  const api = await Api.initialize({}, 'wss://hack.hydradx.io:9944');
  expect(api).toBeDefined();

  // return Api.initialize({}, 'wss://hack.hydradx.io:9944').then((api) => {
  //   expect(api).toBeDefined();
  // });
});