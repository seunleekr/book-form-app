"use client";

import { Suspense, ReactNode } from "react";
import { useFormContext, Controller, ControllerProps } from "react-hook-form";
import { QueryKey } from "@tanstack/react-query";
import { AutoCompleteQuery } from "./AutoCompleteQuery";
import { Option } from "./AutoComplete";
import { ErrorBoundary } from "./ErrorBoundary";
import { InputHTMLAttributes } from "react";

interface RHFAutoCompleteWithSuspenseProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "name" | "onSelect"
  > {
  name: string;
  queryKey: QueryKey;
  queryFn: () => Promise<Option[]>;
  control?: ControllerProps["control"];
  loadingFallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
  onSelect?: (option: Option) => void;
}

const defaultLoadingFallback = (
  <div
    style={{
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      textAlign: "center",
      backgroundColor: "#f5f5f5",
    }}
  >
    <div>로딩 중...</div>
  </div>
);

export function RHFAutoCompleteWithSuspense({
  name,
  queryKey,
  queryFn,
  control,
  loadingFallback,
  errorFallback,
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
        <ErrorBoundary fallback={errorFallback}>
          <Suspense fallback={loadingFallback || defaultLoadingFallback}>
            <AutoCompleteQuery
              {...props}
              queryKey={queryKey}
              queryFn={queryFn}
              value={field.value || ""}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              onSelect={onSelect}
              style={{
                ...(fieldState.error
                  ? { border: "1px solid red", outline: "none" }
                  : { border: "1px solid #ccc" }),
                ...props.style,
              }}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    />
  );
}

