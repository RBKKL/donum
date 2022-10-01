export const Input = () => {
  return (
    <div className="flex h-14 px-8 justify-between rounded-2xl bg-zinc-700">
      <input className="flex h-full w-full font-inter bg-transparent outline-none font-medium text-2xl"/>
      <div className="flex flex-1 flex-auto flex-row items-center">
        <img src="eth.svg"></img>
        <p className="font-inter font-medium text-xl pl-2">ETH</p>
      </div>
    </div>
  );
}
