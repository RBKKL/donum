import { FC, ReactNode, useEffect } from "react";
import { useLogin } from "@hooks/useLogin";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { SessionStatus } from "@donum/shared/constants";
import { Loader } from "./Loader";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";

export const AuthCheck: FC<{
  children: ReactNode;
  check?: boolean;
}> = ({ children, check }) => {
  const { login } = useLogin();
  const { status } = useSession();
  const { isConnected } = useAccount();

  useEffect(() => {
    console.log(
      `status: ${status}, isConnected: ${isConnected}, check: ${check}`
    );
    if (check && isConnected && status === SessionStatus.UNAUTHENTICATED) {
      login();
    }
  }, [status, isConnected]);

  if (!check) return <>{children}</>;

  if (status === SessionStatus.LOADING) return <Loader />;

  if (!isConnected) return <ConnectWalletWarning />;

  if (status === SessionStatus.UNAUTHENTICATED) {
    return <div>Login to see this page</div>;
  }

  return <>{children}</>;
};
