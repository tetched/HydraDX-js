import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

let api: HydraApiPromise;

test('Test getSpotPrice structure', async () => {
  let price;

  api = await Api.initialize({}, process.env.WS_URL);

  price = await api.hydraDx.query.getSpotPrice('1000', '2000', '500');
  expect(price.toString()).toBe('1000');

  price = await api.hydraDx.query.getSpotPrice('1000', '0', '500');
  expect(price.toString()).toBe('0');
});
