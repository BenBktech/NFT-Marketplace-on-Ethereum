import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios'
//
import { Button, ButtonGroup, Box, Image, Heading, Badge, Text } from '@chakra-ui/react'
//
import Contract from '../NFTMarketplace.json';
const marketContractAddress: string = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//
import Header from '../components/Header';
//
import { useAccount } from '@web3modal/react';

export default function Home() {

    const { account } = useAccount()

    const [nfts, setNfts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        //Get smart contract and get all the NFTs on the Marketplace
        const provider = new ethers.providers.JsonRpcProvider('');
        const NFTMarketplace = new ethers.Contract(marketContractAddress, Contract.abi, provider)
        const data = await NFTMarketplace.fetchNFTs()

        //Map through all the NFTs and create the NFTs object to display them later
        const allNFTS = await Promise.all(data.map(async nft => {
            const id = nft.nftId.toString();
            const tokenURI = await NFTMarketplace.tokenURI(id)
            //Convert BigNumber to String
            let price = ethers.utils.formatUnits(nft.price.toString(), 'ether')
            const metadatas = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            let nftObject = {}
            const go = await axios.get(metadatas).then(async response => {
                let name = response.data.name;
                let image = response.data.image;
                let description = response.data.description;

                image = await image.replace("ipfs://", "https://ipfs.io/ipfs/");
                
                nftObject = {
                    name: name,
                    image: image,
                    description: description,
                    tokenId: id,
                    price: price,
                    seller: nft.seller,
                    owner: nft.owner,
                }
            })
            return nftObject
        }))
        setNfts(allNFTS)
    }
    
    return (
        <div className="home">
            <Header />
            <div className="body">
                {account.isConnected ? 
                (
                    nfts.length == 0 ? (
                        <Text>No NFTs to display right now :o</Text>
                    ) : (
                        <>
                            <Text mb="1rem">{nfts.length} NFT{nfts.length > 1 && 's'}</Text>
                            {nfts.map((nft) => {
                                return (
                                    <div key={nft.id}>
                                        <Box 
                                            maxW='sm' 
                                            borderWidth='1px' 
                                            borderRadius='lg' 
                                            overflow='hidden' 
                                            className="nftItemElement"
                                        >
                                            <Image src={nft.image} alt={nft.name} />
                                            <Box p='6'>
                                                <Box
                                                    mt='1'
                                                    fontWeight='semibold'
                                                    as='h3'
                                                    lineHeight='tight'
                                                    noOfLines={1}
                                                >
                                                    {nft.name}
                                                </Box>
                                                <Box
                                                    mt='1'
                                                    lineHeight='tight'
                                                    noOfLines={1}
                                                >
                                                    {nft.description}
                                                </Box>
                                                <Box
                                                    mt='1'
                                                    lineHeight='tight'
                                                    noOfLines={1}
                                                >
                                                    <Badge colorScheme='purple'>
                                                        <Text fontWeight="bold" as="span">{nft.price}</Text> <Text as="span">Eth</Text>
                                                    </Badge>
                                                </Box>
                                                <Button mt='1rem' colorScheme='purple' width='100%' size='lg' onClick={() => buyNft(nft)}>
                                                    Buy
                                                </Button>
                                            </Box>
                                        </Box>
                                    </div>
                                )
                            })}
                        </>
                    )
                ) : (
                    <Text>Please connect your Wallet</Text>
                )}
            </div>
        </div>
    )
}
