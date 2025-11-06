"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Zod 스키마
const step4Schema = z
  .object({
    totalPages: z
      .number({ message: "총 페이지 수는 숫자여야 합니다." })
      .min(1, "총 페이지 수는 1 이상이어야 합니다."),
    quotes: z
      .array(
        z.object({
          text: z.string().min(1, "인용구를 입력해주세요."),
          page: z
            .number({ message: "페이지 번호는 숫자여야 합니다." })
            .min(1, "페이지 번호는 1 이상이어야 합니다."),
        })
      )
      .min(1, "최소 1개 이상의 인용구가 필요합니다."),
  })
  .superRefine((data, ctx) => {
    data.quotes.forEach((quote, index) => {
      if (quote.page > data.totalPages) {
        ctx.addIssue({
          code: "custom",
          message: "인용구 페이지 번호는 도서 전체 페이지 수보다 작아야 합니다.",
          path: ["quotes", index, "page"],
        });
      }
    });
  });

type Step4Values = z.infer<typeof step4Schema>;

export default function Step4Form() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      totalPages: 300, // ✅ 예시 기본값
      quotes: [{ text: "", page: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "quotes" });

  const onSubmit = (data: Step4Values) => {
    console.log("📖 Step4 제출 데이터:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "450px",
        marginTop: "20px",
      }}
    >
      <h2>Step 4 — 인용구 입력</h2>

      {/* ✅ 도서 전체 페이지 수 입력 */}
      <label>
        도서 전체 페이지 수
        <input
          type="number"
          {...register("totalPages", { valueAsNumber: true })}
          placeholder="예: 300"
        />
        {errors.totalPages && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.totalPages.message}
          </span>
        )}
      </label>

      {/* ✅ 인용구 리스트 */}
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
              style={{ width: "100%", resize: "vertical" }}
            />
            {errors.quotes?.[index]?.text && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.quotes[index]?.text?.message}
              </span>
            )}
          </label>

          <label>
            페이지 번호
            <input
              type="number"
              {...register(`quotes.${index}.page` as const, { valueAsNumber: true })}
              placeholder="예시: 125"
            />
            {errors.quotes?.[index]?.page && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.quotes[index]?.page?.message}
              </span>
            )}
          </label>

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
        onClick={() => append({ text: "", page: 1 })}
        style={{
          background: "#f0f0f0",
          border: "1px dashed #aaa",
          padding: "8px",
          cursor: "pointer",
        }}
      >
        + 인용구 추가
      </button>

      <button type="submit">다음</button>
    </form>
  );
}
