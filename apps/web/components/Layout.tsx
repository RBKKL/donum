import { FC, ReactNode } from "react";
import { Header } from "@components/Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col py-3 px-2 sm:px-8">
    <Header />
    <main className="flex grow items-center justify-center pt-12">
      {children}
    </main>
  </div>
);
