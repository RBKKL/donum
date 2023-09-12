import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACT_NAME } from "@donum/shared/constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // deploy the contract
  console.log("Deploying the contract...");
  const deployment = await deploy(CONTRACT_NAME, {
    from: deployer,
    log: true,
    waitConfirmations: 10, // wait 10 blocks for the contract to be verified
  });

  // verify the contract
  console.log("Verifying the contract...");
  await hre.run("verify:verify", {
    address: deployment.address,
  });
};
func.tags = [CONTRACT_NAME];
export default func;
