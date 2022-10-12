import { FC, ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col py-3 px-8">
    <Header />
    <main>{children}</main>
  </div>
);
