"use client";

import { useRouter } from "next/navigation";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { firstErrorPath } from "@/lib/formUtils";
import { CommaSeparatedInput } from "./CommaSeparatedInput";
import { FormValues } from "@/context/FormContext";


const quoteSchema = z.object({
  text: z.string().min(1, "인용구를 입력해주세요."),
  page: z
    .union([
      z
        .number({ message: "페이지 번호는 숫자만 입력 가능합니다." })
        .min(1, "페이지 번호는 1 이상이어야 합니다.")
        .int("페이지 번호는 정수만 입력 가능합니다."),
      z.nan().refine(() => false, {
        message: "페이지 번호는 숫자만 입력 가능합니다.",
      }),
    ])
    .optional(),
});

const step4Schema = z
  .object({
    totalPages: z
      .number({ message: "총 페이지 수는 숫자여야 합니다." })
      .min(1, "총 페이지 수는 1 이상이어야 합니다."),
    quotes: z.array(quoteSchema).min(1, "인용구를 최소 1개 이상 입력해주세요."),
  })
  .superRefine((data, ctx) => {
    if (data.quotes.length > 1) {
      data.quotes.forEach((quote, index) => {
        if (!quote.page || quote.page === undefined || quote.page === null) {
          ctx.addIssue({
            code: "custom",
            message: "두 개 이상의 인용구가 있을 경우 페이지 번호는 필수 입력 항목입니다.",
            path: ["quotes", index, "page"],
          });
        }
      });
    }

    data.quotes.forEach((quote, index) => {
      if (quote.page !== undefined && quote.page !== null) {
        if (isNaN(quote.page)) {
          ctx.addIssue({
            code: "custom",
            message: "페이지 번호는 숫자만 입력 가능합니다.",
            path: ["quotes", index, "page"],
          });
        }
        
        if (quote.page < 1) {
          ctx.addIssue({
            code: "custom",
            message: "페이지 번호는 1 이상이어야 합니다.",
            path: ["quotes", index, "page"],
          });
        }
        
        if (quote.page >= data.totalPages) {
          ctx.addIssue({
            code: "custom",
            message: "인용구 페이지 번호는 도서 전체 페이지 수보다 작아야 합니다.",
            path: ["quotes", index, "page"],
          });
        }
      }
    });
  });

export default function Step4Form() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setError,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: "quotes" 
  });

  const totalPages = watch("totalPages");
  const quotes = watch("quotes");

  const onInvalid = () => {
    const firstError = firstErrorPath(errors);
    if (firstError) setFocus(firstError as any);
  };

  const onSubmit = async (data: FormValues) => {
    const step4Data = {
      totalPages: data.totalPages,
      quotes: data.quotes,
    };
    const result = step4Schema.safeParse(step4Data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      Object.keys(fieldErrors).forEach((key) => {
        const error = fieldErrors[key as keyof typeof fieldErrors];
        if (error && error[0]) {
          setError(key as any, {
            type: "validation",
            message: error[0],
          });
        }
      });
      
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const fieldPath = issue.path.join(".");
          setError(fieldPath as any, {
            type: "validation",
            message: issue.message,
          });
        }
      });
      
      const firstError = firstErrorPath(result.error.flatten().fieldErrors);
      if (firstError) {
        setFocus(firstError as any);
      } else if (result.error.issues.length > 0) {
        const firstIssue = result.error.issues[0];
        if (firstIssue.path.length > 0) {
          setFocus(firstIssue.path.join(".") as any);
        }
      }
      return;
    }
    console.log("Step4 제출 데이터:", step4Data);
    router.push("/form/step5");
  };
  
  const errorStyle = (path: string) => 
    path ? { border: "1px solid red", outline: "none" } : { border: "1px solid #ccc"};

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "450px",
        marginTop: "20px",
      }}
    >
      <h2>Step 4 — 인용구 입력</h2>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 전체 페이지 수
        <Controller
          name="totalPages"
          control={control}
          render={({ field }) => (
            <CommaSeparatedInput
              {...field}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              ref={field.ref}
              placeholder="예: 300"
              style={{
                ...errorStyle(errors.totalPages ? "totalPages" : ""),
                borderRadius: "6px",
                padding: "4px",
              }}
            />
          )}
        />
        {errors.totalPages && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.totalPages.message}
          </span>
        )}
      </label>

      {fields.map((field, index) => (
        <div
          key={field.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <label>
            인용구
            <textarea
              {...register(`quotes.${index}.text` as const)}
              placeholder="인상 깊은 구절을 입력해주세요."
              rows={3}
              style={{ 
                width: "100%",
                resize: "vertical",
                borderRadius: "6px",
                ...errorStyle(errors.quotes?.[index]?.text ? "text" : ""),
              }}
            />
            {errors.quotes?.[index]?.text && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.quotes[index]?.text?.message}
              </span>
            )}
          </label>

          {quotes && quotes.length > 1 && (
            <label>
              페이지 번호 <span style={{ color: "red" }}>*</span>
              <input
                type="number"
                {...register(`quotes.${index}.page` as const, {
                  valueAsNumber: true,
                  required: "페이지 번호를 입력해주세요.",
                  validate: (value) => {
                    if (value === undefined || value === null || isNaN(value)) {
                      return "두 개 이상의 인용구가 있을 경우 페이지 번호는 필수 입력 항목입니다.";
                    }
                    
                    if (!Number.isInteger(value)) {
                      return "페이지 번호는 정수만 입력 가능합니다.";
                    }
                    
                    if (value < 1) {
                      return "페이지 번호는 1 이상이어야 합니다.";
                    }
                    
                    if (totalPages && value >= totalPages) {
                      return "인용구 페이지 번호는 도서 전체 페이지 수보다 작아야 합니다.";
                    }
                    
                    return true;
                  },
                })}
                placeholder="예시: 125"
                style={{
                  ...errorStyle(errors.quotes?.[index]?.page ? "page" : ""),
                  borderRadius: "6px",
                  padding: "4px",
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "+" ||
                    e.key === "-" ||
                    e.key === "."
                  ) {
                    e.preventDefault();
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  const value = target.value;
                  if (value && !/^\d+$/.test(value)) {
                    target.value = value.replace(/[^\d]/g, "");
                  }
                }}
              />
              {errors.quotes?.[index]?.page && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.quotes[index]?.page?.message}
                </span>
              )}
            </label>
          )}

          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              style={{
                alignSelf: "flex-end",
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
              }}
            >
              ✕ 삭제
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ text: "", page: undefined })}
        style={{
          background: "#f0f0f0",
          border: "1px dashed #aaa",
          padding: "8px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        + 인용구 추가
      </button>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/form/step3")}
          style={{
            background: '#f0f0f0',
            border: "1px solid #ccc",
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >이전 단계로 이동
        </button>

      <button type="submit"
      style={{
        background: '#0070f3',
        border: "none",
        color: 'white',
        padding: "8px 16px",
        borderRadius: '6px',
        cursor: 'pointer',
      }}
      >다음 단계로 이동
        </button>
      </div>
    </form>
  );
}
