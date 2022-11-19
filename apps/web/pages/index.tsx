import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "@components/Button";
import { ALERT_PAGE_PATH, DASHBOARD_PAGE_PATH } from "shared/constants";

const MY_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";

const Home: NextPage = () => {
  return (
    <div className="flex h-96 w-full flex-col items-center justify-center pt-1 text-center">
      <Link href={`/${MY_ADDRESS}`}>
        <Button text="Donate me" />
      </Link>
      <Link href={DASHBOARD_PAGE_PATH} className="mt-3">
        <Button text="Dashboard" />
      </Link>
      <Link href={`${ALERT_PAGE_PATH}/${MY_ADDRESS}`} className="mt-3">
        <Button text="Donation alert" />
      </Link>
      <Link href={`/devonly/sign-in/`} className="mt-3">
        <Button text="Sign-in" />
      </Link>
    </div>
  );
};

export default Home;
