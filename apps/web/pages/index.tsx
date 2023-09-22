import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "~/components/Button";
import { routes } from "~/lib/routes";

const Home: NextPage = () => {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      <Link href={routes.dashboard} className="mt-3">
        <Button text="Dashboard" />
      </Link>
      <Link href={routes.alert} className="mt-3">
        <Button text="Test alert" />
      </Link>
      <Link href={routes.authorization()} className="mt-3">
        <Button text="Authorization" />
      </Link>
    </div>
  );
};

export default Home;
