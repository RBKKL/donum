import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@components/Button";

const MY_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";

const Home: NextPage = () => {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      <Link href={`/c/${MY_ADDRESS}`}>
        <Button text="Donate me" />
      </Link>
      <Link href={`/dashboard/${MY_ADDRESS}`} className="mt-3">
        <Button text="Dashboard" />
      </Link>
      <Link href={`/alert/${MY_ADDRESS}`} className="mt-3">
        <Button text="Donation alert" />
      </Link>
      <Link href={`/dev-only/sign-in/`} className="mt-3">
        <Button text="Sign-in" />
      </Link>
    </div>
  );
};

export default Home;
