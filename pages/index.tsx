import type { NextPage } from "next";
import Head from "next/head";
import { APP_NAME } from "@lib/constants";
import { ConnectKitButton } from "connectkit";
import { Account } from "@components/Account";
import {TextField} from "@components/TextField";
import {Button} from "@components/Button";
import {RecipientProfile} from "@components/RecipientProfile";
import {Input} from "@components/Input";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center py-3 px-2">
      <Head>
        <title>{APP_NAME}</title>
      </Head>

      <main className="w-full">
        <h1 className="px-10 text-3xl">{APP_NAME}</h1>
        <div className="flex flex-col items-center text-center pt-16">
          <RecipientProfile
            avatarPath="/shelban.png"
            nickname="Nix"
            address="0xdB4c373FA35630F0E1d5bA1182f6c65a14FeF27b"
          />
          <div className="flex flex-col w-full min-w-0 max-w-lg pt-12">
            <Input/>
            <div className="py-4">
              <TextField/>
            </div>
            <div className="flex flex-row-reverse">
              <Button>
                Send
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
