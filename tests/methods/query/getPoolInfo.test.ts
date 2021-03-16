import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

let api: HydraApiPromise;
let HydraAccount = '5EKq4zjH8skHctyTS5QGaQYQnw3xyPW6cqkAPLPhwiap62DQ';

test('Test getPoolInfo structure', async () => {
  api = await Api.initialize({}, 'wss://rpc-01.snakenet.hydradx.io');
  const getPoolInfo = await api.hydraDx.query.getPoolInfo(HydraAccount);
  
  expect(getPoolInfo).toEqual(
    {
      "poolInfo": {}, 
      "shareTokenIds": [], 
      "tokenTradeMap": {}
    }
  );
});
