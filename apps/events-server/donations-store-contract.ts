import { ethers } from "ethers";
import DonationsStoreDeployment from "@donum/contracts/deployments/goerli/DonationsStore.json";
import { DonationsStore } from "@donum/contracts/types/DonationsStore";

const provider = new ethers.providers.InfuraProvider(
  "goerli",
  process.env.NEXT_PUBLIC_INFURA_ID
);

export const DonationsStoreContract = new ethers.Contract(
  DonationsStoreDeployment.address,
  DonationsStoreDeployment.abi,
  provider
) as DonationsStore;
