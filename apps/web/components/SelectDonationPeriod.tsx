import classNames from "classnames";
import { Dispatch, FC, SetStateAction } from "react";

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
    <select
      value={selected}
      onChange={(event) => onSelect(+event.target.value)}
      className={classNames(
        "bg-zinc-900 text-2xl font-semibold focus:outline-none",
        className
      )}
    >
      {options.map((option) => (
        <option
          className="font-semibold"
          key={option.value}
          value={option.value}
        >
          {option.text}
        </option>
      ))}
    </select>
  );
};
