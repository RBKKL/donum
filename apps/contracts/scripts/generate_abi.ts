// script for generating the abi as a const to be used in the frontend
// as temporary solution for https://github.com/wagmi-dev/wagmi/issues/1090

import path from "path";
import fs from "fs";
import { artifacts } from "hardhat";

async function generateAbi() {
  const contractName = "DonationsStore";
  const ContractArtifact = artifacts.readArtifactSync(contractName);

  const abiPath = path.join(__dirname, "..", "abis", `${contractName}ABI.ts`);

  const abiTs = `export const ${contractName}ABI = ${JSON.stringify(
    ContractArtifact.abi,
    null,
    2
  )} as const;`;

  fs.writeFileSync(abiPath, abiTs);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
generateAbi().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
