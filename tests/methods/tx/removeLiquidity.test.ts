import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';

import { createPool } from '../../utils/createPool';
import { removeLiquidity } from '../../utils/removeLiquidity';
import { getAliceAccount } from '../../utils/getAliceAccount';

let api: HydraApiPromise;

test('Test removeLiquidity', async () => {
  api = await Api.initialize({}, process.env.WS_URL);

  const alice = getAliceAccount();
  const assetList = await api.hydraDx.query.getAssetList(alice.address);
  const asset1 = assetList[0].assetId;
  const asset2 = assetList[assetList.length - 1].assetId;

  await createPool(api, alice, asset1.toString(), asset2.toString(), '1000000000', '500000000');
  let targetBalance = await api.hydraDx.query.getAccountBalances(alice.address);
  expect(targetBalance[targetBalance.length - 1].balanceFormatted).toBe('1000000000');

  await removeLiquidity(api, alice, asset1.toString(), asset2.toString(), '500000000');
  targetBalance = await api.hydraDx.query.getAccountBalances(alice.address);
  expect(targetBalance[targetBalance.length - 1].balanceFormatted).toBe('500000000');
});
