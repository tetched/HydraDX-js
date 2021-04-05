import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';
import { createPool } from '../../utils/createPool';
import { getAliceAccount } from '../../utils/getAliceAccount';

test('Test getTokenAmount structure', async () => {
  let price;

  const api = await Api.initialize({}, process.env.WS_URL);
  const alice = getAliceAccount();
  const assetList = await api.hydraDx.query.getAssetList(alice.address);

  const asset1 = assetList[0].assetId.toString();
  const asset2 = assetList[assetList.length - 1].assetId.toString();
  
  await createPool(api, alice, asset1, asset2, '1000000000', '500000000');
  price = await api.hydraDx.query.getTokenAmount(alice.address, assetList[11].assetId.toString());

  expect(price.toString()).toBe('1000000000');
});
