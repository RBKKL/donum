import { Dispatch, FC, SetStateAction } from "react";
import * as Select from "@radix-ui/react-select";
import { ArrowIcon } from "./icons/ArrowIcon";

export interface SelectOption {
  value: number;
  text: string;
}

interface SelectDonationPeriodProps {
  options: SelectOption[];
  selected: number;
  onSelect: Dispatch<SetStateAction<number>>;
  className?: string;
}

export const SelectDonationPeriod: FC<SelectDonationPeriodProps> = ({
  options,
  selected,
  onSelect,
  className = "",
}) => {
  return (
    <div className={className}>
      <Select.Root
        value={"" + selected}
        onValueChange={(newValue) => onSelect(+newValue)}
      >
        <Select.Trigger className="flex items-center gap-4 rounded-xl border border-yellow-500 px-2 py-1 text-2xl text-yellow-500 focus:outline-none">
          <Select.Value>
            {options.find((option) => option.value === selected)!.text}
          </Select.Value>
          <ArrowIcon />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="rounded-xl border border-yellow-500 bg-zinc-900 px-3 py-2">
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  className="cursor-pointer text-2xl hover:text-yellow-500 hover:outline-none focus:outline-none"
                  value={"" + option.value}
                >
                  <Select.ItemText>{option.text}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
