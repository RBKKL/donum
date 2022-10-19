import "@styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppType } from "next/app";
import Head from "next/head";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createClient, chain } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { ALERT_PAGE_PATH, APP_NAME, INFURA_ID } from "@lib/constants";
import { Layout } from "@components/Layout";
import { trpc } from "@lib/trpc";

const usedChains = [
  // chain.mainnet,
  // chain.polygon,
  chain.goerli, // Ethereum's Goerli Testnet
  chain.localhost, // Hardhat localhost network
];

const { chains, provider } = configureChains(usedChains, [
  infuraProvider({ apiKey: INFURA_ID }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: APP_NAME,
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const MyApp: AppType = ({ Component, pageProps, router }) => {
  if (router.pathname.includes(ALERT_PAGE_PATH)) {
    return <Component {...pageProps} />;
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Head>
            <title>{APP_NAME}</title>
          </Head>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
