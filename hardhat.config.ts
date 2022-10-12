import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import type { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "tsconfig-paths/register";
import { CHAIN_IDS, INFURA_ID } from "@lib/constants";

const privateKey = process.env.PRIVATE_KEY ?? "NO_PRIVATE_KEY";

const getChainConfig = (
  network: keyof typeof CHAIN_IDS
): NetworkUserConfig => ({
  accounts: [`0x${privateKey}`],
  chainId: CHAIN_IDS[network],
  url: `https://${network}.infura.io/v3/${INFURA_ID}`,
});

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: CHAIN_IDS.hardhat,
      allowUnlimitedContractSize: false,
    },
    mainnet: getChainConfig("mainnet"),
    goerli: getChainConfig("goerli"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./scripts/deploy-contracts",
    deployments: "./deployments",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  mocha: {
    timeout: 1000000,
  },
};

export default config;
