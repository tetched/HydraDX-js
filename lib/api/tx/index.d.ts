declare function mintAssetSMWallet(account: any, assetId: any): Promise<void>;
declare function addLiquiditySMPool(account: string, asset1: string, asset2: string, amount: any, spotPrice: number): Promise<unknown>;
declare function withdrawLiquiditySMPool(account: string, asset1: string, asset2: string, liquidityBalance: any, selectedPool: any, percentage: number): Promise<unknown>;
declare function swapSMTrade(account: string, asset1: string, asset2: string, amount: any, actionType: string): Promise<unknown>;
export { mintAssetSMWallet, addLiquiditySMPool, withdrawLiquiditySMPool, swapSMTrade };
