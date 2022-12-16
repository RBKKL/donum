import { FC, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { SessionStatus } from "@donum/shared/constants";
import { Loader } from "./Loader";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";

export const AuthCheck: FC<{
  children: ReactNode;
  check?: boolean;
}> = ({ children, check }) => {
  const { status } = useSession();
  const { isConnected } = useAccount();

  if (!check) return <>{children}</>;

  if (status === SessionStatus.LOADING) return <Loader />;

  if (!isConnected) return <ConnectWalletWarning />;

  return <>{children}</>;
};
