// await NFTMarketplace.createToken("ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json", ethers.utils.parseEther('1'))

const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther('0.1')

async function fetchNFTs() {
    const accounts = await ethers.getSigners();
    console.log(accounts[0].address)
    const nftMarketplace = await ethers.getContract('NFTMarketplace')
    let allFiles = await nftMarketplace.connect(accounts[0]).fetchMyNFTs()
    console.log(allFiles)
}

fetchNFTs() 
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.log(error) 
        process.exit(1)
    })