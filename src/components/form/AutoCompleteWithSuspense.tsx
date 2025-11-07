"use client";

import { Suspense, Component, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { AutoComplete, Option } from "./AutoComplete";
import { InputHTMLAttributes } from "react";

interface AutoCompleteWithSuspenseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  queryKey: string[];
  queryFn: () => Promise<Option[]>;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: Option) => void;
  placeholder?: string;
  loadingFallback?: ReactNode;
  rejectedFallback?: (error: Error) => ReactNode;
}

function AutoCompleteContent({
  queryKey,
  queryFn,
  value,
  onChange,
  onSelect,
  placeholder,
  ...props
}: Omit<AutoCompleteWithSuspenseProps, "loadingFallback" | "rejectedFallback">) {
  const { data: options, error } = useQuery({
    queryKey,
    queryFn,
    suspense: true,
  });

  if (error) {
    throw error;
  }

  return (
    <AutoComplete
      options={options || []}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      placeholder={placeholder}
      {...props}
    />
  );
}

class AutoCompleteErrorBoundary extends Component<
  {
    children: ReactNode;
    rejectedFallback?: (error: Error) => ReactNode;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: ReactNode;
    rejectedFallback?: (error: Error) => ReactNode;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("AutoComplete error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.rejectedFallback) {
        return this.props.rejectedFallback(this.state.error);
      }
      return (
        <div
          style={{
            padding: "12px",
            border: "1px solid #f44336",
            borderRadius: "6px",
            backgroundColor: "#ffebee",
            color: "#c62828",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>에러 발생</div>
          <div>{this.state.error.message}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AutoCompleteWithSuspense({
  queryKey,
  queryFn,
  value,
  onChange,
  onSelect,
  placeholder,
  loadingFallback,
  rejectedFallback,
  ...props
}: AutoCompleteWithSuspenseProps) {
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

  return (
    <AutoCompleteErrorBoundary rejectedFallback={rejectedFallback}>
      <Suspense fallback={loadingFallback || defaultLoadingFallback}>
        <AutoCompleteContent
          queryKey={queryKey}
          queryFn={queryFn}
          value={value}
          onChange={onChange}
          onSelect={onSelect}
          placeholder={placeholder}
          {...props}
        />
      </Suspense>
    </AutoCompleteErrorBoundary>
  );
}

