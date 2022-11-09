import { CHAIN_IDS } from "shared/constants";
import DonationsStoreContractGoerli from "contracts/deployments/goerli/DonationsStore.json";

// inline as temporary solution for https://github.com/wagmi-dev/wagmi/issues/1090
// copied from apps/contracts/artifacts/contracts/DonationsStore.sol/DonationsStoreABI.ts
export const DonationsStoreABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "NewDonation",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "string",
        name: "_message",
        type: "string",
      },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "recipients",
    outputs: [
      {
        internalType: "string",
        name: "nickname",
        type: "string",
      },
      {
        internalType: "string",
        name: "avatarURI",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_nickname",
        type: "string",
      },
      {
        internalType: "string",
        name: "_avatarURI",
        type: "string",
      },
    ],
    name: "setRecipientInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.hardhat]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [CHAIN_IDS.goerli]: DonationsStoreContractGoerli.address,
};

export const getContractAddressByChainId = (
  chainId: number | undefined
): string => {
  if (chainId == undefined) {
    return "";
  }

  return CONTRACT_ADDRESSES[chainId];
};
