import BigNumber from 'bignumber.js'
import Api from '../../../src/api';
import { HydraApiPromise } from '../../../src/types';
import { getAliceAccount } from '../../utils/getAliceAccount';
import { getRandomAccount } from '../../utils/getRandomAccount';
import { setBalance } from '../../utils/setBalance';

let api: HydraApiPromise;

test('Test getFreeTokenAmount structure', async () => {
  api = await Api.initialize({}, process.env.WS_URL);
  const alice = getAliceAccount();
  const target = getRandomAccount();

  let freeToken = await api.hydraDx.query.getFreeTokenAmount(alice.address, '0');

  await setBalance(api, alice, (new BigNumber(freeToken).minus('1000000000')).toString(), '1000000000');

  freeToken = await api.hydraDx.query.getFreeTokenAmount(alice.address, '0');
  // const frozenFee = await api.hydraDx.query.getFrozenFeeTokenAmount(alice.address, '0');
  // const miscFrozen = await api.hydraDx.query.getMiscFrozenTokenAmount(alice.address, '0');
  // const reservedToken = await api.hydraDx.query.getReservedTokenAmount(alice.address, '0');
  

  console.log(freeToken.toString());
  // console.log(frozenFee.toString());
  // console.log(miscFrozen.toString());
  // console.log(reservedToken.toString());
});
