import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

let api: HydraApiPromise;
let HydraAccount = '5EKq4zjH8skHctyTS5QGaQYQnw3xyPW6cqkAPLPhwiap62DQ';

test('Test getAssetList structure', async () => {
  api = await Api.initialize({}, process.env.WS_URL);
  const assetList = await api.hydraDx.query.getAssetList(HydraAccount);
  
  expect(assetList).toEqual(
    [
      {
        assetId: 0,
        name: 'HDX'
      },
      {
        "assetId": 1,
        "name": "tKSM",
      },
      {
        "assetId": 2,
        "name": "tDOT",
      },
      {
        "assetId": 3,
        "name": "tETH",
      },
      {
        "assetId": 4,
        "name": "tACA",
      },
      {
        "assetId": 5,
        "name": "tEDG",
      },
      {
        "assetId": 6,
        "name": "tUSD",
      },
      {
        "assetId": 7,
        "name": "tPLM",
      },
      {
        "assetId": 8,
        "name": "tFIS",
      },
      {
        "assetId": 9,
        "name": "tPHA",
      },
      {
        "assetId": 10,
        "name": "tUSDT",
      }
    ]
  );
});
