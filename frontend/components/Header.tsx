import { Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { Text } from '@chakra-ui/react';
import { useAccount, ConnectButton } from '@web3modal/react';

export default function Header() {

    const { account } = useAccount()

    return (
        <div className="header">
            <Heading as='h3' size='lg'>
                <Link href="/">
                    NFT Marketplace
                </Link>
            </Heading>
            <ul className="header__menu">
                <li>
                    <Link href="/mynfts">My NFTs</Link>
                </li>
                <li>
                    <Link href="/create-nft">Create a NFT</Link>
                </li>
            </ul>
            <div className="wallet">
                
                {account.isConnected ? (
                    <>
                        <Text fontWeight="bold" className="address">
                            {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}
                        </Text>
                    </>
                ) : (
                    <ConnectButton  />
                )}
            </div>
        </div>
    )
}