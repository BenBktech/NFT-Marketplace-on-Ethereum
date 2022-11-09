import { network } from "hardhat"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { verify } from "../utils/verify"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'ethers'

let args: any = []

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const NFTMarketplace = await deploy('NFTMarketplace', {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});

    console.log(`Contract NFTMarketplace deployed at address ${NFTMarketplace.address}`)

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(NFTMarketplace.address, args)
    }

};

export default func;
func.tags = ['NFTMarketplace'];