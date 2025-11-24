"use client";

import { useFormContext, Controller, ControllerProps } from "react-hook-form";
import { CommaSeparatedInput } from "./CommaSeparatedInput";
import { InputHTMLAttributes } from "react";

interface RHFCommaSeparatedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "name"> {
  name: string;
  control?: ControllerProps["control"];
}

export function RHFCommaSeparatedInput({
  name,
  control,
  ...props
}: RHFCommaSeparatedInputProps) {
  const formContext = useFormContext();
  const actualControl = control || formContext.control;

  if (!actualControl) {
    throw new Error("RHFCommaSeparatedInput must be used within FormProvider or with control prop");
  }

  return (
    <Controller
      name={name}
      control={actualControl}
      render={({ field, fieldState }) => (
        <CommaSeparatedInput
          {...props}
          value={field.value}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      )}
    />
  );
}

