import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACT_NAME } from "@lib/constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy(CONTRACT_NAME, {
    from: deployer,
    log: true,
  });
};
func.tags = [CONTRACT_NAME];
export default func;
