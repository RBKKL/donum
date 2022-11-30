import { Dispatch, FC, SetStateAction } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { ArrowIcon } from "./icons/ArrowIcon";

interface SelectOption {
  value: string;
  text: string;
}

interface SelectProps {
  options: SelectOption[];
  selected: string;
  onSelect: Dispatch<SetStateAction<string>>;
}

export const Select: FC<SelectProps> = ({ options, selected, onSelect }) => {
  return (
    <RadixSelect.Root
      value={selected}
      onValueChange={(newValue) => onSelect(newValue)}
    >
      <RadixSelect.Trigger className="flex items-center gap-4 rounded-xl border border-yellow-500 px-2 py-1 text-2xl text-yellow-500 focus:outline-none">
        <RadixSelect.Value>
          {options.find((option) => option.value === selected)?.text}
        </RadixSelect.Value>
        <ArrowIcon size="extra-small" />
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className="rounded-xl border border-yellow-500 bg-zinc-900 px-3 py-2">
          <RadixSelect.Viewport>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                className="cursor-pointer text-2xl hover:text-yellow-500 hover:outline-none focus:outline-none"
                value={option.value}
              >
                <RadixSelect.ItemText>{option.text}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};
