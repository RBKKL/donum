import { ethers, InfuraProvider } from "ethers";
import DonationsStoreDeployment from "@donum/contracts/deployments/goerli/DonationsStore.json";
import { DonationsStore } from "@donum/contracts/types";
import { env } from "./env";

const provider = new InfuraProvider("goerli", env.INFURA_ID);

export const DonationsStoreContract = new ethers.Contract(
  DonationsStoreDeployment.address,
  DonationsStoreDeployment.abi,
  provider
) as unknown as DonationsStore;
