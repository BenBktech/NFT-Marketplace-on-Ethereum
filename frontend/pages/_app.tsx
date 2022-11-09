import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Web3Modal } from '@web3modal/react'
import { chains, providers } from "@web3modal/ethereum";

export default function App({ Component, pageProps }: AppProps) {

  const config = {
    theme: 'dark',
    accentColor: 'purple',
    ethereum: {
        appName: 'web3Modal',
        chains: [chains.hardhat],
        providers: [
            providers.walletConnectProvider({
                projectId: process.env.NEXT_PUBLIC_WEBMODAL_ID,
            })
        ]
    },
    projectId: process.env.NEXT_PUBLIC_WEBMODAL_ID,
  }


  return (
    <ChakraProvider>
      <Component {...pageProps} />
      <Web3Modal config={config} />
    </ChakraProvider>
  )
}
