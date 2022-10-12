import { FC } from "react";
import { APP_NAME } from "@lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header: FC = () => (
  <header className="flex w-full justify-between">
    <h1 className="text-3xl">{APP_NAME}</h1>
    <ConnectButton />
  </header>
);
