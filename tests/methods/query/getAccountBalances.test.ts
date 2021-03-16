import BigNumber from 'bignumber.js';
import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

let api: HydraApiPromise;
let HydraAccount = '5EKq4zjH8skHctyTS5QGaQYQnw3xyPW6cqkAPLPhwiap62DQ';

test('Test getAccountBalances structure', async () => {
  api = await Api.initialize({}, 'wss://rpc-01.snakenet.hydradx.io');
  const accountBalances = await api.hydraDx.query.getAccountBalances(HydraAccount);
  
  expect(accountBalances).toEqual(
    [{
      assetId: 0,
      balance: new BigNumber('0'),
      balanceFormatted: '0'
    }]
  );
});
