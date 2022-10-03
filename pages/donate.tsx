import { APP_NAME } from "@lib/constants";
import { useState } from "react";

function isNumber(value: string): boolean {
  return !!value.match(/^\d*\.?\d*$/);
}

export default function Donate() {
  const MAX_TEXTAREA_LENGTH = 256;
  const [donateAmount, setDonateAmount] = useState("10.0");
  const [message, setMessage] = useState("");

  const submitHandler = () => {
    alert(`donate: ${donateAmount} \nmessage: ${message}`);
  };

  return (
    <>
      <header className="pb-7">
        <h1 className="text-2xl pl-12 pt-4 font-jeju-gothic text-zinc-50">
          {APP_NAME}
        </h1>
      </header>
      <main className="flex flex-col items-center font-inter text-zinc-50 pb-10 px-3">
        <div className="w-50 h-50 rounded-15 border-3 border-zinc-50 relative overflow-hidden">
          <img
            className="w-full h-full absolute object-cover inset-2/4 translate-x-anti-2/4 translate-y-anti-2/4"
            src="/assets/images/sticker1.gif"
            alt="Streamer pic"
          />
        </div>
        <h2 className="font-semibold text-xl pt-1">Nix</h2>
        <h3 className="text-sm pt-2 pb-12 text-center flex justify-center w-full sm:w-128">
          <span className="text-ellipsis overflow-hidden whitespace-nowrap w-2/4 sm:w-fit">
            0xdB4c373FA35630F0E1d5bA1182f6c65a14F
          </span>
          eF27b
        </h3>
        <form className="w-full sm:w-128">
          <div className="flex items-center bg-zinc-700 h-14 rounded-15 px-8 py-3.5">
            <input
              className="w-full bg-inherit focus:outline-none"
              type="text"
              value={donateAmount}
              onChange={(e) =>
                isNumber(e.target.value) && setDonateAmount(e.target.value)
              }
            />
            <img
              className="px-2"
              src="/assets/svgs/ethirium.svg"
              alt="Ethirium icon"
            />
            <span className="text-sm font-medium">ETH</span>
          </div>
          <div className="flex flex-col bg-zinc-700 rounded-15 p-4 mt-4">
            <textarea
              className="bg-inherit h-60 resize-none focus:outline-none text-sm"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_TEXTAREA_LENGTH}
            ></textarea>
            <span className="w-full text-gray-400 text-xs text-right pt-3">
              {message.length}/{MAX_TEXTAREA_LENGTH}
            </span>
          </div>
          <button
            onClick={submitHandler}
            className="bg-yellow-500 px-8 py-2 rounded-30 w-full mt-4 font-semibold sm:w-fit sm:float-right"
          >
            Send
          </button>
        </form>
      </main>
    </>
  );
}
