import { FC, ReactNode } from "react";
import { useLogin } from "@hooks/useLogin";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { SessionStatus } from "@donum/shared/constants";
import { Loader } from "./Loader";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";
import { Button } from "./Button";

export const AuthCheck: FC<{
  children: ReactNode;
  check?: boolean;
}> = ({ children, check }) => {
  const { login } = useLogin();
  const { status } = useSession();
  const { isConnected } = useAccount();

  if (!check) return <>{children}</>;

  if (status === SessionStatus.LOADING) return <Loader />;

  if (!isConnected) return <ConnectWalletWarning />;

  if (status === SessionStatus.UNAUTHENTICATED) {
    return (
      <div className="flex flex-col">
        <div>Login to see this page</div>
        <Button onClick={login} text="Login" />
      </div>
    );
  }

  return <>{children}</>;
};
