"use client";

import { forwardRef, InputHTMLAttributes, useState, useEffect } from "react";

interface CommaSeparatedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value?: number;
  onChange?: (value: number | undefined) => void;
}

export const CommaSeparatedInput = forwardRef<HTMLInputElement, CommaSeparatedInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>("");

    useEffect(() => {
      if (value === undefined || value === null || isNaN(value)) {
        setDisplayValue("");
      } else {
        setDisplayValue(value.toLocaleString("ko-KR"));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const numericValue = inputValue.replace(/,/g, "");

      if (numericValue === "") {
        setDisplayValue("");
        onChange?.(undefined);
        return;
      }

      if (!/^\d+$/.test(numericValue)) {
        return;
      }

      const numValue = parseInt(numericValue, 10);

      const formattedValue = numValue.toLocaleString("ko-KR");
      setDisplayValue(formattedValue);

      onChange?.(numValue);
    };

    const handleBlur = () => {
      if (displayValue) {
        const numericValue = displayValue.replace(/,/g, "");
        if (/^\d+$/.test(numericValue)) {
          const numValue = parseInt(numericValue, 10);
          setDisplayValue(numValue.toLocaleString("ko-KR"));
        }
      }
    };

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }
);

CommaSeparatedInput.displayName = "CommaSeparatedInput";

