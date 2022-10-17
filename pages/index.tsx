import { Button } from "@components";
import type { NextPage } from "next";
import Link from "next/link";

const MY_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col w-full h-96 justify-center items-center text-center pt-1">
      <Link href={`/c/${MY_ADDRESS}`}>
        <a>
          <Button text="Donate me" />
        </a>
      </Link>
      <Link href={`/dashboard/${MY_ADDRESS}`}>
        <a className="mt-3">
          <Button text="Dashboard" />
        </a>
      </Link>
      <Link href={`/alert/${MY_ADDRESS}`}>
        <a className="mt-3">
          <Button text="Donation alert" />
        </a>
      </Link>
    </div>
  );
};

export default Home;
