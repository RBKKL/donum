import type { NextPage } from "next";
import Head from "next/head";
import { APP_NAME } from "@lib/constants";
import { ConnectKitButton } from "connectkit";
import { Account } from "@components/Account";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>{APP_NAME}</title>
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">{APP_NAME}</h1>
        <ConnectKitButton />
        <Account />
      </main>
    </div>
  );
};

export default Home;
