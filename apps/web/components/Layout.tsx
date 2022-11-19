import { FC, ReactNode, useEffect } from "react";
import { Header } from "@components/Header";
import { useLogin } from "@hooks/useLogin";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { SessionStatus } from "shared/constants";
import { Loader } from "./Loader";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";
import { routes } from "@lib/routes";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { login } = useLogin();
  const router = useRouter();
  const { status } = useSession();
  const { isConnected } = useAccount();

  const isSecured = router.pathname.startsWith(routes.dashboard);

  useEffect(() => {
    if (isSecured && isConnected && status === "unauthenticated") {
      login();
    }
  }, [status, isConnected, isSecured]);

  const SecuredContent = () => {
    if (status === SessionStatus.LOADING) return <Loader />;

    if (!isConnected) return <ConnectWalletWarning />;

    if (status === SessionStatus.UNAUTHENTICATED) {
      return <div>Login to see this page</div>;
    }

    return <>{children}</>;
  };

  return (
    <div className="flex min-h-screen flex-col py-3 px-2 sm:px-8">
      <Header />
      <main className="flex grow items-center justify-center pt-12">
        {isSecured ? <SecuredContent /> : children}
      </main>
    </div>
  );
};
