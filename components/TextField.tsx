import {useState} from "react";

export const TextField = () => {
  const [length, setLength] = useState(0);
  const maxLength = 256;

  return (
    <div className="flex flex-col w-full h-76 p-4 rounded-2xl bg-zinc-700">
      <textarea
        placeholder="Type your message here..."
        className="h-full font-inter text-lg bg-transparent outline-none resize-none"
        maxLength={maxLength}
        onChange={e => setLength(e.target.value.length)}
      />
      <p className="font-inter flex flex-row-reverse text-xs text-gray-400">
        {length}/{maxLength}
      </p>
    </div>
  );
}
