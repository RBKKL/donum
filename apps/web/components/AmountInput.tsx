import { useEffect, useRef, useState, type FC, type ChangeEvent } from "react";
import { isNumber } from "@donum/shared/helpers";
import { Input, InputProps } from "@components/Input";
import { MAX_DONATION_AMOUNT_LENGTH } from "@donum/shared/constants";

type AmountInputProps = Omit<InputProps, "onChangeRaw">;

// onChange is called after validation
export const AmountInput: FC<AmountInputProps> = ({ onChange, ...props }) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref?.current) {
      ref.current.setSelectionRange(selection.start, selection.end);
    }
  }, [selection]);

  const onChangeRawWrapper = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.currentTarget.value;

    if (newValue.length > 2 && newValue.includes(",")) {
      newValue = newValue.replace(",", ".");
    }

    const isValid = (val: string): boolean => {
      return (
        (isNumber(val) || val === "") &&
        val.length <= MAX_DONATION_AMOUNT_LENGTH
      );
    };

    const selectionStart = e.currentTarget.selectionStart ?? 0;
    const selectionEnd = e.currentTarget.selectionEnd ?? 0;

    if (isValid(newValue)) {
      onChange?.(newValue);

      setSelection({
        start: selectionStart,
        end: selectionEnd,
      });
    } else {
      // start and end positions are never less than 1 because user at least entered 1 symbol
      setSelection({
        start: selectionStart - 1,
        end: selectionEnd - 1,
      });
    }
  };

  return <Input ref={ref} onChangeRaw={onChangeRawWrapper} {...props} />;
};
