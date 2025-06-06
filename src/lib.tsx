import { BN } from "fuels";
import contractIds from "./sway-api/contract-ids.json";

export const environments = { LOCAL: "local", TESTNET: "testnet" };
export const environment =
  process.env.VITE_DAPP_ENVIRONMENT || environments.LOCAL;
export const isLocal = environment === environments.LOCAL;
export const isTestnet = environment === environments.TESTNET;

export const localProviderUrl = `http://127.0.0.1:${process.env.VITE_FUEL_NODE_PORT || 4000}/v1/graphql`;
export const localChainId = 0;
export const testnetProviderUrl = "https://testnet.fuel.network/v1/graphql";
export const testnetChainId = 0;
export const providerUrl = isLocal ? localProviderUrl : testnetProviderUrl;
export const providerChainId = isLocal ? localChainId : testnetChainId;
export const playgroundUrl = providerUrl.replace("v1/graphql", "v1/playground");

export const crowdfundingLocalContractId = contractIds.crowdfundingContract;
export const crowdfundingTestnetContractId = process.env.TEST_NET_CROWDFUNDING_CONTRACT_ID as string;
export const crowdfundingContractId = isLocal ? crowdfundingLocalContractId : crowdfundingTestnetContractId;

export const testnetFaucetUrl = "https://faucet-testnet.fuel.network/";

export const renderTransactionId = (transactionId: string) => {
  if (isLocal) {
    return transactionId;
  }

  return (
    <a
      href={`https://app-testnet.fuel.network/tx/${transactionId}/simple`}
      target="_blank"
      rel="noreferrer"
      className="underline"
    >
      {transactionId}
    </a>
  );
};

export const renderFormattedBalance = (balance: BN) => {
  return balance.format({ precision: 4 });
};
