import type { NextPage } from "next";
import { Button } from "@components/Button";
import { useLogin } from "@hooks/useLogin";

const SignIn: NextPage = () => {
  const { login } = useLogin();

  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      <p className="mb-3 text-lg font-bold">Sign in</p>
      <Button onClick={login} text="Sign in with Ethereum" />
    </div>
  );
};

export default SignIn;
