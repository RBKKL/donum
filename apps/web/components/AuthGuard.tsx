import { FC, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { SessionStatus } from "@donum/shared/constants";
import { Loader } from "./Loader";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";

export const AuthGuard: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();
  const { isConnected } = useAccount();

  if (!isConnected) return <ConnectWalletWarning />;

  if (status === SessionStatus.LOADING) return <Loader />;

  if (status === SessionStatus.UNAUTHENTICATED) {
    router.push(routes.authorization(router.asPath));
    return null;
  }

  return <>{children}</>;
};
