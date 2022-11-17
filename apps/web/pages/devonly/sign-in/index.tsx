import { NextPage } from "next";
import { useAccount, useConnect } from "wagmi";
import { Button } from "@components/Button";
import { signOut, useSession } from "next-auth/react";
import { useLogin } from "@hooks/useLogin";

const SignInPage: NextPage = () => {
  const { isConnected, connector } = useAccount();
  const { login } = useLogin();

  const { connect } = useConnect({ connector });
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
          onClick={() => (isConnected ? login() : connect())}
        />
      )}
    </div>
  );
};

export default SignInPage;
