import "@styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { APP_NAME, INFURA_ID } from "@lib/constants";

const client = createClient(
  getDefaultClient({
    appName: APP_NAME,
    infuraId: INFURA_ID,
    autoConnect: true,
    chains: [
      chain.goerli, // Ethereum's Goerli Testnet
      chain.hardhat, // Ethereum's Hardhat Default Network
    ],
  })
);

console.log(INFURA_ID);

const MyApp = ({ Component, pageProps }: AppProps) => (
  <WagmiConfig client={client}>
    <ConnectKitProvider mode="dark" theme="midnight">
      <Component {...pageProps} />
    </ConnectKitProvider>
  </WagmiConfig>
);

export default MyApp;
