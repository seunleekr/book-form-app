"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { AutoComplete, Option } from "./AutoComplete";
import { InputHTMLAttributes } from "react";

export interface AutoCompleteQueryProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onSelect"> {
  queryKey: string[];
  queryFn: () => Promise<Option[]>;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: Option) => void;
  placeholder?: string;
}

export function AutoCompleteQuery({
  queryKey,
  queryFn,
  value,
  onChange,
  onSelect,
  placeholder,
  ...props
}: AutoCompleteQueryProps) {
  const { data: options } = useSuspenseQuery({
    queryKey,
    queryFn,
  });

  return (
    <AutoComplete
      options={options}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      placeholder={placeholder}
      {...props}
    />
  );
}

