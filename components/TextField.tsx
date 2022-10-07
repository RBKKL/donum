import {useState} from "react";
import {MESSAGE_MAX_LENGTH} from "@lib/constants";

export const TextField = () => {
  const [length, setLength] = useState(0);

  return (
    <div className="flex flex-col w-full p-4 rounded-2xl bg-zinc-700">
      <textarea
        placeholder="Type your message here..."
        className="h-full text-lg bg-transparent outline-none resize-none"
        rows={11}
        maxLength={MESSAGE_MAX_LENGTH}
        onChange={e => setLength(e.target.value.length)}
      />
      <p className="flex flex-row-reverse text-xs text-gray-400">
        {length}/{MESSAGE_MAX_LENGTH}
      </p>
    </div>
  );
}
