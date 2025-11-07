"use client";

import { useFormContext, Controller, ControllerProps } from "react-hook-form";
import { AutoCompleteWithSuspense, Option } from "./AutoCompleteWithSuspense";
import { InputHTMLAttributes } from "react";

interface RHFAutoCompleteWithSuspenseProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "name"
  > {
  name: string;
  queryKey: string[];
  queryFn: () => Promise<Option[]>;
  control?: ControllerProps["control"];
  loadingFallback?: React.ReactNode;
  rejectedFallback?: (error: Error) => React.ReactNode;
  onSelect?: (option: Option) => void;
}

export function RHFAutoCompleteWithSuspense({
  name,
  queryKey,
  queryFn,
  control,
  loadingFallback,
  rejectedFallback,
  onSelect,
  ...props
}: RHFAutoCompleteWithSuspenseProps) {
  const formContext = useFormContext();
  const actualControl = control || formContext.control;

  if (!actualControl) {
    throw new Error(
      "RHFAutoCompleteWithSuspense must be used within FormProvider or with control prop"
    );
  }

  return (
    <Controller
      name={name}
      control={actualControl}
      render={({ field, fieldState }) => (
        <AutoCompleteWithSuspense
          queryKey={queryKey}
          queryFn={queryFn}
          value={field.value || ""}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          onSelect={onSelect}
          loadingFallback={loadingFallback}
          rejectedFallback={rejectedFallback}
          style={{
            ...(fieldState.error
              ? { border: "1px solid red", outline: "none" }
              : { border: "1px solid #ccc" }),
            ...props.style,
          }}
          {...props}
        />
      )}
    />
  );
}

