import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@components/Button";

const MY_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";

const Home: NextPage = () => {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      <Link href={`/c/${MY_ADDRESS}`}>
        <a>
          <Button text="Donate me" />
        </a>
      </Link>
      <Link href={`/profile/edit`}>
        <a className="mt-3">
          <Button text="Edit profile" />
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
