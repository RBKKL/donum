import { FC, ReactNode, useEffect } from "react";
import { Header } from "@components/Header";
import { useLogin } from "@hooks/useLogin";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { DASHBOARD_PAGE_PATH } from "shared/constants";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { login } = useLogin();
  const router = useRouter();
  const { status } = useSession();
  const { isConnected } = useAccount();

  const isSecured = router.pathname.includes(DASHBOARD_PAGE_PATH);
  useEffect(() => {
    if (isSecured && isConnected && status === "unauthenticated") {
      login();
    }
  }, [status, isConnected, router.pathname]);

  return (
    <div className="flex min-h-screen flex-col py-3 px-2 sm:px-8">
      <Header />
      {isSecured ? (
        status === "loading" ? (
          <div>Loading...</div>
        ) : status === "unauthenticated" ? (
          <div>Login to see this page</div>
        ) : (
          <main className="pt-12">{children}</main>
        )
      ) : (
        <main className="pt-12">{children}</main>
      )}
    </div>
  );
};
