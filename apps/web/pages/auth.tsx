import type { NextPage } from "next";
import { Button } from "@components/Button";
import { useLogin } from "@hooks/useLogin";
import { useSession } from "next-auth/react";
import { SessionStatus } from "@donum/shared/constants";
import { Loader } from "@components/Loader";
import { signOut } from "next-auth/react";

const Auth: NextPage = () => {
  const { login } = useLogin();
  const { status, data } = useSession();

  if (status === SessionStatus.LOADING) return <Loader />;

  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      {status === SessionStatus.UNAUTHENTICATED ? (
        <>
          <p className="mb-3 text-lg font-bold">Sign in</p>
          <Button onClick={login} text="Sign in with Ethereum" />
        </>
      ) : (
        <>
          <p className="mb-3 text-lg font-bold">
            You are signed in as {data?.user?.name || data?.user?.address}
          </p>
          <Button onClick={signOut} text="Sign out" />
        </>
      )}
    </div>
  );
};

export default Auth;
