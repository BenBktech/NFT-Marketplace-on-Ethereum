import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios'
import { NFTStorage, File, Blob } from 'nft.storage'
//
import { useToast, Text, Input, Button, Textarea, Spinner } from '@chakra-ui/react';
//
import Contract from '../NFTMarketplace.json';
const marketContractAddress: string = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//
import Header from '../components/Header';
//
import { useAccount, useSigner } from '@web3modal/react'

export default function Home() {

    const { data, error } = useSigner()
    const { account } = useAccount()
    const toast = useToast()
    const router = useRouter()

    const [nfts, setNfts] = useState([])
    const [nftImg, setNftImg] = useState('')
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false)

    async function OnChangeFile(e) {
        setIsUploadingToIPFS(true)
        const client = new NFTStorage({
            token: process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY,
        })

        const metaData = await client.store({
            name: formInput.name,
            description: formInput.description,
            image: e.target.files[0],
        });
        setNftImg(metaData.url)
        setIsUploadingToIPFS(false)
    }

    const addToMarketplace = async() => {
        if(nftImg.length > 0 && formInput.name.length > 0 && formInput.description.length > 0 && parseFloat(formInput.price) > 0) {
            try {
                setIsLoading(true)
                const NFTMarketplace = new ethers.Contract(marketContractAddress, Contract.abi, data)
                let transaction = await NFTMarketplace.createNFT(nftImg, ethers.utils.parseEther(formInput.price), { value: ethers.utils.parseEther('0.025')})
                await transaction.wait()
    
                toast({
                    description: "Congratulations! You have minted your NFT!",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                });
                setIsLoading(false)
    
                router.push('/')
            }
            catch {
                toast({
                    description: "An error occured",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        }
        else {
            toast({
                description: "Please fill in all the fields of the form",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    }
    
    return (
        <div className="home">
            <Header />
            <div className="body">
                {account.isConnected ? (
                    isLoading ? (
                        <>
                            <Spinner /> <Text>We are creating your NFT</Text>
                        </>
                    ) : (
                        <>
                            <Input placeholder='Asset Name' size='lg' onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
                            <Textarea
                                mt="1rem"
                                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                                placeholder='Description'
                                size='lg'
                            />
                            <Input mt="1rem" placeholder='Price in ETH' size='lg' onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
                            <Input mt="1rem" type="file" placeholder='Image file' size='lg' onChange={(e) =>OnChangeFile(e)} />
                            {isUploadingToIPFS ? (
                                <Button mt="1rem" isLoading colorScheme='purple' size='lg' width='100%'>
                                </Button>
                            ) : (
                                <Button mt="1rem" colorScheme='purple' size='lg' width='100%' onClick={() => addToMarketplace()}>
                                    Add NFT to the Marketplace
                                </Button>
                            )}
                        </>
                    )
                ) : (
                    <Text>Please connect your Wallet</Text>
                )}
            </div>
        </div>
    )
}