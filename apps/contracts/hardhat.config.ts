import type { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "tsconfig-paths/register";
import { CHAIN_IDS } from "./constants";
import { env } from "./env";

const getChainConfig = (
  network: keyof typeof CHAIN_IDS
): NetworkUserConfig => ({
  accounts: env.PRIVATE_KEY ? [`0x${env.PRIVATE_KEY}`] : [],
  chainId: CHAIN_IDS[network],
  url: `https://${network}.infura.io/v3/${env.INFURA_ID}`,
});

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: env.REPORT_GAS,
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
    deployments: "./deployments",
    deploy: "./scripts/deploy-contracts",
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
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
  etherscan: {
    apiKey: env.ETHERSCAN_API_KEY,
  },
};

export default config;
