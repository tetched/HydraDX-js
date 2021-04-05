import type { Codec } from '@polkadot/types/types';
import type { Balance } from '@polkadot/types/interfaces/runtime';
import BigNumber from "bignumber.js";
import { AssetBalance, AssetRecord, PoolInfo, TokenTradeMap } from '../../types';
import Api from '../../api';

interface AccountAmount extends Codec {
  free?: Balance;
}

let wasm: any;

async function initialize() {
  if (typeof window !== 'undefined') {
    if (typeof process.env.NODE_ENV === "undefined") {
      wasm = await import('hack-hydra-dx-wasm/build/web');
      wasm.default();
    } else {
      const { import_wasm } = await import('../../utils/import_wasm');
      wasm = await import_wasm();
    }
    
  } else {
    wasm = await import('hack-hydra-dx-wasm/build/nodejs');
  }
}

initialize();

async function getAccountBalances(account: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
      const balances: AssetBalance[] = [];
    
      if (account && api) {
        const multiTokenInfo = await api.query.tokens.accounts.entries(account);
        const baseTokenInfo = await api.query.system.account(account);
        const baseTokenBalance = new BigNumber(baseTokenInfo.data.free.toString());
    
        balances[0] = {
          assetId: 0,
          balance: baseTokenBalance,
          // balanceFormatted: formatBalance(baseTokenBalance),
          balanceFormatted: baseTokenBalance.toString()
        };
        multiTokenInfo.forEach(record => {
          let assetId = 99999;
    
          const assetInfo = record[0].toHuman();
          if (Array.isArray(assetInfo) && typeof assetInfo[1] === 'string') {
            assetId = parseInt(assetInfo[1]);
          }
    
          const assetBalances = api.createType('AccountData', record[1]);
          // const balance = bnToBn(assetBalances.free);
          // const balanceFormatted = formatBalance(balance);
          const balance = new BigNumber(assetBalances.free.toString());
          const balanceFormatted = balance.toString();
    
          balances[assetId] = {
            assetId,
            balance,
            balanceFormatted,
          };
        });
      }
    
      resolve(balances);
    } catch(e) {
      reject(e);
    }
  });
}

async function getAssetList() {
  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
      if (!api) return resolve([]);
      const assetIds = await api.query.assetRegistry.assetIds.entries();
      const assetList: AssetRecord[] = [{ assetId: 0, name: 'HDX' }];
    
      // TODO: Better way to parse mapped records
      assetIds.forEach(([assetName, id]) => {
        const assetId = parseInt(api.createType('Option<u32>', id).toString());
        const name = assetName.toHuman()?.toString() || '0xERR';
    
        assetList[assetId] = { assetId, name };
      });
    
      resolve(assetList);
    } catch(e) {
      reject(e);
    }
  });
};

async function getPoolInfo() {
  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
      if (!api) return reject();
      const allPools = await api.query.amm.poolAssets.entries();
      const allTokens = await api.query.amm.shareToken.entries();
  
      const poolInfo: PoolInfo = {};
  
      const shareTokenIds: number[] = [];
      const tokenTradeMap: TokenTradeMap = {};
  
      allPools.forEach(([key, value]) => {
        const poolId = key.toHuman()?.toString() || 'ERR';
        const poolAssets = api
          .createType('Vec<u32>', value)
          .map(assetId => assetId.toNumber())
          .sort((a, b) => a - b);
  
        poolAssets.forEach((asset, key) => {
          const otherAsset = poolAssets[+!key];
  
          if (!tokenTradeMap[asset]) tokenTradeMap[asset] = [];
          if (tokenTradeMap[asset].indexOf(otherAsset) === -1) {
            tokenTradeMap[asset].push(otherAsset);
          }
        });
  
        poolInfo[poolId] = {
          poolAssets,
          shareToken: 99999,
          poolAssetNames: [],
        };
      });
  
      allTokens.forEach(([key, value]) => {
        const poolId = key.toHuman()?.toString() || 'ERR';
        const shareToken = api.createType('u32', value).toNumber();
  
        shareTokenIds.push(shareToken);
  
        poolInfo[poolId].shareToken = shareToken;
      });
  
      resolve({
          tokenTradeMap,
          shareTokenIds,
          poolInfo
      });
    } catch(e) {
      reject(e);
    }
  });
    
}

async function getSpotPrice(asset1Id: string, asset2Id: string, amount: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
    
      if (api) {
        const assetsAmounts = await getPoolAssetsAmounts(asset1Id, asset2Id);

        if (
            assetsAmounts === null ||
            assetsAmounts.asset1 === null ||
            assetsAmounts.asset2 === null
        )
          return;

        const price = new BigNumber(await wasm.get_spot_price(assetsAmounts.asset1, assetsAmounts.asset2, amount));
        resolve(price);
      }
    } catch(e) {
      reject(e);
    }
  });
};

async function getTradePrice(asset1Id: string, asset2Id: string, tradeAmount: string, actionType: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
    
      if (api) {
          // let amount = bnToBn(0);
          let amount = new BigNumber(0);
  
          if (tradeAmount) {
              const assetsAmounts = await getPoolAssetsAmounts(asset1Id, asset2Id);

              if (
                  assetsAmounts === null ||
                  assetsAmounts.asset1 === null ||
                  assetsAmounts.asset2 === null
              )
                return;

              if (actionType === 'sell') {
                  amount = new BigNumber(await wasm.get_sell_price(assetsAmounts.asset1, assetsAmounts.asset2, tradeAmount));
              } else if (actionType === 'buy') {
                  amount = new BigNumber(await wasm.get_buy_price(assetsAmounts.asset1, assetsAmounts.asset2, tradeAmount));
              }
          }
          resolve(amount);
      }
    } catch(e) {
      reject(e);
    }
  });
};

/**
 * getTokenAmount returns tokens amount for provided account (pool, wallet)
 * @param accountId: string
 * @param assetId: string
 */
const getTokenAmount = async (
  accountId: string,
  assetId: string
): Promise<number | null> => {
  const api = Api.getApi();
  if (!api) return null;

  if (assetId === '0') {
    return (await api.query.system.account(accountId)).data.free.toNumber();
  } else {
    const amount: AccountAmount = await api.query.tokens.accounts(
        accountId,
        assetId
    );
    return amount.free ? amount.free.toNumber() : null;
  }
};

/**
 * getAssetsAmounts fetches amounts for pair of assets within pool.
 * @param asset1Id: string | null
 * @param asset2Id: string | null
 */
const getPoolAssetsAmounts = async (
  asset1Id: string | null,
  asset2Id: string | null
): Promise<{
  asset1: string | null;
  asset2: string | null;
  accountAddress: string;
} | null> => {
  if (
      (asset1Id !== null && asset1Id.length === 0) ||
      asset1Id === null ||
      (asset2Id !== null && asset2Id.length === 0) ||
      asset2Id === null
  )
    return null;

  const api = Api.getApi();

  if (!api) return null;

  const poolsList = await api.query.amm.poolAssets.entries();

  //TODO should be create type for poolsList (api.createType())
  const parsedPoolsList = poolsList.map(item => {
    return [item[0].toHuman(), item[1].toHuman()];
  });

  /**
   * parsedPoolsList has next structure
   * [
   *    [['7MK4PSbXskZhKTiGk4K4w7Ut59ZZndUupZxMHBDxgxiGZgpa'], ['1', '2']],
   *    [['7Hx1UVo75qgr8cy7VFqGTL4r99HRVWdn864HFter2aa2LSqW'], ['0', '1']],
   * ]
   */

  const currentPool = parsedPoolsList.find(
      poolInfo =>
          asset1Id !== null &&
          asset2Id !== null &&
          poolInfo[1] &&
          //@ts-ignore
          poolInfo[1].includes(asset1Id) &&
          //@ts-ignore
          poolInfo[1].includes(asset2Id)
  );

  //@ts-ignore
  const currentPoolId = currentPool ? currentPool[0][0] : null;

  if (!currentPoolId) {
    return null;
  }

  const asset1Amount = await getTokenAmount(currentPoolId, asset1Id);
  const asset2Amount = await getTokenAmount(currentPoolId, asset2Id);

  return {
    asset1: asset1Amount !== null ? asset1Amount.toString() : null,
    asset2: asset2Amount !== null ? asset2Amount.toString() : null,
    accountAddress: currentPoolId,
  };
};


export {
    getAccountBalances,
    getAssetList,
    getPoolInfo,
    getSpotPrice,
    getTradePrice,
    getTokenAmount,
    getPoolAssetsAmounts,
}