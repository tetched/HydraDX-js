import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

let api: HydraApiPromise;

test('Test getTradePrice structure', async () => {
  let price;

  api = await Api.initialize({}, process.env.WS_URL);

  price = await api.hydraDx.query.getTradePrice('1000', '2000', '500', 'sell');
  expect(price.toString()).toBe('667');

  price = await api.hydraDx.query.getTradePrice('1', '0', '0', 'sell');
  expect(price.toString()).toBe('1');

  price = await api.hydraDx.query.getTradePrice('1000', '2000', '500', 'buy');
  expect(price.toString()).toBe('334');

  price = await api.hydraDx.query.getTradePrice('0', '1', '0', 'buy');
  expect(price.toString()).toBe('1');
});
