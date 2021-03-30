import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';
import { getAliceAccount } from '../../utils/getAliceAccount';

let api: HydraApiPromise;

test('Test getPoolInfo structure', async () => {
  api = await Api.initialize({}, process.env.WS_URL);

  const alice = getAliceAccount();
  const getPoolInfo = await api.hydraDx.query.getPoolInfo(alice.address);
  
  expect(getPoolInfo).toEqual(
    {
      "poolInfo": {}, 
      "shareTokenIds": [], 
      "tokenTradeMap": {}
    }
  );
});
