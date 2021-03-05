import { AssetBalance, AssetRecord, PoolInfo, TokenTradeMap } from '../../types';
import Api from '../../api';
import BigNumber from "bignumber.js";


async function getAccountBalances(account: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
      const balances: AssetBalance[] = [];
    
      if (account && api) {
        const multiTokenInfo = await api.query.tokens.accounts.entries(account);
        const baseTokenInfo = await api.query.system.account(account);
        // const baseTokenBalance = bnToBn(baseTokenInfo.data.free);
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

async function getSpotPrice(asset1: string, asset2: string) {
  const wasm = await import('hack-hydra-dx-wasm');

  console.log(wasm);

  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
    
      if (api) {
        const amount = await wasm.get_spot_price(asset1, asset2, '1000000000000');
        // // @ts-expect-error TS-2339
        // const amountData = await api.rpc.amm.getSpotPrice(asset1, asset2, 1000000000000);
        // const amount = amountData.amount;
  
        resolve(amount);
      }
    } catch(e) {
      reject(e);
    }
  });
};

async function getTradePrice(asset1: string, asset2: string, tradeAmount: any, actionType: string) {
  const wasm = await import('hack-hydra-dx-wasm');

  console.log(wasm);

  return new Promise(async (resolve, reject) => {
    try {
      const api = Api.getApi();
    
      if (api) {
          // let amount = bnToBn(0);
          let amount = new BigNumber(0);
  
          if (tradeAmount) {
              if (actionType === 'sell') {
                  amount = new BigNumber(await wasm.get_sell_price(asset1, asset2, tradeAmount));
                  // // @ts-expect-error TS-2339
                  // const amountData = await api.rpc.amm.getSellPrice(asset1, asset2, tradeAmount);
                  // amount = amountData.amount;
              } else {
                  amount = new BigNumber(await wasm.get_buy_price(asset1, asset2, tradeAmount));
                  // // @ts-expect-error TS-2339
                  // const amountData = await api.rpc.amm.getBuyPrice(asset1, asset2, tradeAmount);
                  // amount = amountData.amount;
              }
          }
          resolve(amount);
      }
    } catch(e) {
      reject(e);
    }
  });
};


export {
    getAccountBalances,
    getAssetList,
    getPoolInfo,
    getSpotPrice,
    getTradePrice,
}