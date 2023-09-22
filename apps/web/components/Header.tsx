import { FC } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { APP_NAME } from "@donum/shared/constants";
import { routes } from "~/lib/routes";

export const Header: FC = () => (
  <header className="flex w-full justify-between">
    <Link href={routes.home}>
      <h1 className="text-3xl">{APP_NAME}</h1>
    </Link>
    <ConnectButton />
  </header>
);
