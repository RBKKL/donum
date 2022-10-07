import { ethers } from "hardhat";
import { CONTRACT_NAME } from "@lib/constants";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(`Deployer address ${owner.address}`);
  const Contract = await ethers.getContractFactory(CONTRACT_NAME, owner);
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log(`Contract "${CONTRACT_NAME}" deployed at ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
