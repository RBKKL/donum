import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@components/Button";
import { routes } from "@lib/routes";
import { DEFAULT_ADDRESS } from "shared/constants";

const Home: NextPage = () => {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      <Link href={routes.donate(DEFAULT_ADDRESS)}>
        <Button text="Donate me" />
      </Link>
      <Link href={routes.dashboard} className="mt-3">
        <Button text="Dashboard" />
      </Link>
      <Link href={`/devonly/sign-in/`} className="mt-3">
        <Button text="Sign-in" />
      </Link>
    </div>
  );
};

export default Home;
