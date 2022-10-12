import type { NextPage } from "next";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { APP_NAME } from "@lib/constants";
import { Button, RecipientProfile, Input, TextField } from "@components";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>

      <div className="flex flex-col items-center text-center pt-16">
        <RecipientProfile
          avatarPath="/shelban.png"
          nickname="Nix"
          address="0xdB4c373FA35630F0E1d5bA1182f6c65a14FeF27b"
        />
        <div className="flex flex-col w-full min-w-0 max-w-lg pt-12">
          <Input />
          <div className="py-4">
            <TextField />
          </div>
          <div className="flex flex-row-reverse">
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
