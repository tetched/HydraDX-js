import BigNumber from 'bignumber.js';
import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';
import { getAliceAccount } from '../../utils/getAliceAccount';

let api: HydraApiPromise;

test('Test getMarketcap structure', async () => {
  api = await Api.initialize({}, process.env.WS_URL);
  const alice = getAliceAccount();

  api.hydraDx.query.getMarketcap(alice.address);
});
