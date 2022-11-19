import "@styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppType } from "next/app";
import Head from "next/head";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createClient, chain } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { APP_NAME } from "@donum/shared/constants";
import { Layout } from "@components/Layout";
import { trpc } from "@lib/trpc";
import { clientEnv } from "@env/client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { StrictMode } from "react";
import { Inter } from "@next/font/google";

const usedChains = [
  // chain.mainnet,
  // chain.polygon,
  chain.goerli, // Ethereum's Goerli Testnet
  chain.localhost, // Hardhat localhost network
];

const { chains, provider } = configureChains(usedChains, [
  infuraProvider({ apiKey: clientEnv.INFURA_ID }),
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  return (
    <StrictMode>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <SessionProvider session={pageProps.session}>
            <Layout>
              <Head>
                <title>{APP_NAME}</title>
              </Head>
              <div className={`${inter.variable} font-inter`}>
                <Component {...pageProps} />
              </div>
            </Layout>
          </SessionProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </StrictMode>
  );
};

export default trpc.withTRPC(MyApp);
