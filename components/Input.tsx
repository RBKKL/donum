import Image from "next/image";

export const Input = () => {
  return (
    <div className="flex h-14 px-8 justify-between rounded-2xl bg-zinc-700">
      <input className="flex h-full w-full bg-transparent outline-none font-medium text-2xl"/>
      <div className="flex flex-auto flex-row items-center">
        <Image
          src="/eth.svg"
          layout="fixed"
          width={32}
          height={32}
        />
        <p className="font-medium text-xl pl-2">ETH</p>
      </div>
    </div>
  );
}
