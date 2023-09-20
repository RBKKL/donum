import "@styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { injectedWallet } from "@rainbow-me/rainbowkit/wallets"; // For local development
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { APP_NAME } from "@donum/shared/constants";
import { Layout } from "@components/Layout";
import { trpc } from "@lib/trpc";
import { browserEnv } from "@env/browser";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@components/AuthGuard";
import type { Session } from "next-auth";

const usedChains = [
  // mainnet,
  // polygon,
  goerli, // Ethereum's Goerli Testnet
];

const { chains, publicClient } = configureChains(usedChains, [
  infuraProvider({ apiKey: browserEnv.INFURA_ID }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: APP_NAME,
  projectId: browserEnv.WALLETCONNECT_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// eslint-disable-next-line @typescript-eslint/ban-types
export type ExtendedNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: boolean;
};

type ExtendedAppProps = AppProps<{
  session: Session | null;
}> & {
  Component: ExtendedNextPage;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <SessionProvider session={session}>
          <Layout>
            <Head>
              <title>{APP_NAME}</title>
            </Head>
            {Component.requireAuth ? (
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
        </SessionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
