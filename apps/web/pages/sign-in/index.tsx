import { NextPage } from "next";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { Button } from "@components/Button";
import { SiweMessage } from "siwe";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { InjectedConnector } from "@wagmi/core";

const SignInPage: NextPage = () => {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({ connector: new InjectedConnector() });

  const { signMessageAsync } = useSignMessage();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleLogin = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        signature,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {session ? (
        <>
          <p>You are logged in as {session.user?.name}</p>
          <Button text="Sign out" onClick={signOut} />
        </>
      ) : (
        <Button
          text="Sign in"
          onClick={() => (isConnected ? handleLogin() : connect())}
        />
      )}
    </div>
  );
};

export default SignInPage;
