import { FC } from "react";
import Link from "next/link";
import { APP_NAME } from "@lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header: FC = () => (
  <header className="flex w-full justify-between">
    <Link href="/">
      <a>
        <h1 className="text-3xl">{APP_NAME}</h1>
      </a>
    </Link>
    <ConnectButton />
  </header>
);
