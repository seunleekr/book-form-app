"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ zod 스키마 (오타 수정 포함: step3RefinedSchema)
const step3Schema = z.object({
  rating: z
    .number()
    .min(0)
    .max(5)
    .refine((val) => val % 0.5 === 0, "별점은 0.5점 단위여야 합니다."),
  review: z.string().optional(),
});

const step3RefinedSchema = step3Schema.superRefine((data, ctx) => {
  if ((data.rating === 1 || data.rating === 5) && (!data.review || data.review.length < 100)) {
    ctx.addIssue({
      code: "custom",
      message: "별점이 1점 또는 5점인 경우 독후감은 100자 이상이어야 합니다.",
      path: ["review"],
    });
  }
});

type Step3Values = z.infer<typeof step3RefinedSchema>;

export default function Step3Form() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3RefinedSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const rating = watch("rating");
  const review = watch("review");

  const onSubmit = (data: Step3Values) => {
    console.log("Step3 제출 데이터:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)} // ✅ 반드시 추가
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        marginTop: "20px",
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        별점: {rating} / 5
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          {...register("rating", { valueAsNumber: true })}
        />
        {errors.rating && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.rating.message}
          </span>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        독후감 ({review?.length ?? 0}자)
        <textarea
          rows={8}
          placeholder="이 책을 읽고 느낀 점을 자유롭게 작성해주세요."
          {...register("review")}
          style={{ resize: "vertical", padding: "8px" }}
        />
        {errors.review && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.review.message}
          </span>
        )}
      </label>

      <button type="submit">다음</button>
    </form>
  );
}
