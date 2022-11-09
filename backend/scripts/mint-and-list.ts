// await NFTMarketplace.createToken("ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json", ethers.utils.parseEther('1'))

const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther('0.1')

async function mintAndList() {
    const nftMarketplace = await ethers.getContract('NFTMarketplace')
    const mintTx = await nftMarketplace.createToken("ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo", ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('0.025')})
    const mintTxReceipt = await mintTx.wait(1)

    //ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d 
    const mintTx2 = await nftMarketplace.createToken("ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d", ethers.utils.parseEther('0.5'), { value: ethers.utils.parseEther('0.025')})
    const mintTxReceipt2 = await mintTx2.wait(1)

    //ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm
    const mintTx3 = await nftMarketplace.createToken("ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm", ethers.utils.parseEther('0.75'), { value: ethers.utils.parseEther('0.025')})
    const mintTxReceipt3 = await mintTx3.wait(1)

}

mintAndList() 
    .then(() => process.exit(0)) 
    .catch((error) => {
        console.log(error) 
        process.exit(1)
    })