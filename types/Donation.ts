import { BigNumber } from "ethers";

export interface Donation {
  from: string,
  to: string,
  timestamp: BigNumber,
  amount: BigNumber,
  message: string,
}