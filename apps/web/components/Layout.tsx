import { FC, ReactNode, useEffect } from "react";
import { Header } from "@components/Header";
import { useLogin } from "@hooks/useLogin";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { SessionStatus } from "@donum/shared/constants";
import { Loader } from "./Loader";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";
import { routes } from "@lib/routes";
import { Inter } from "@next/font/google";

interface LayoutProps {
  children: ReactNode;
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { login } = useLogin();
  const router = useRouter();
  const { status } = useSession();
  const { isConnected } = useAccount();

  const isSecured = router.pathname.startsWith(routes.dashboard);

  useEffect(() => {
    if (isSecured && isConnected && status === SessionStatus.UNAUTHENTICATED) {
      login();
    }
  }, [status, isConnected, isSecured, login]);

  const SecuredContent = () => {
    if (status === SessionStatus.LOADING) return <Loader />;

    if (!isConnected) return <ConnectWalletWarning />;

    if (status === SessionStatus.UNAUTHENTICATED) {
      return <div>Login to see this page</div>;
    }

    return <>{children}</>;
  };

  return (
    <div
      className={`flex min-h-screen flex-col px-2 pt-3 pb-32 sm:px-8 ${inter.variable} font-inter`}
    >
      <Header />
      <main className="flex grow items-center justify-center pt-12">
        {isSecured ? <SecuredContent /> : children}
      </main>
    </div>
  );
};
