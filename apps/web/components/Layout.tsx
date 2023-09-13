import { FC, ReactNode } from "react";
import { Header } from "@components/Header";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const Layout: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <div
    className={`flex min-h-screen flex-col px-2 pb-32 pt-3 sm:px-8 ${inter.variable} font-inter`}
  >
    <Header />
    <main className="flex grow items-center justify-center pt-12">
      {children}
    </main>
  </div>
);
