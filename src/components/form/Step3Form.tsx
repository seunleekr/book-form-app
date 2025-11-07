"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { firstErrorPath } from "@/lib/formUtils";
import { FormValues } from "@/context/FormContext";

const step3Schema = z
  .object({
  rating: z
    .number()
    .min(0, "별점은 0점 이상이어야 합니다.")
    .max(5, "별점은 5점 이하여야 합니다.")
    .refine((val) => val % 0.5 === 0, "별점은 0.5점 단위여야 합니다."),
  review: z.string().optional(),
})
.superRefine((data, ctx) => {
  if ((data.rating === 1 || data.rating === 5) && (!data.review || data.review.length < 100)) {
    ctx.addIssue({
      code: "custom",
      message: "별점이 1점 또는 5점인 경우 독후감은 100자 이상이어야 합니다.",
      path: ["review"],
    });
  }
});

export default function Step3Form() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    setError,
    formState: { errors },
  } = useFormContext<FormValues>();

  const rating = watch("rating");
  const review = watch("review");

  const onInvalid = () => {
    const firstError = firstErrorPath(errors);
    if (firstError) setFocus(firstError as any);
  };

  const onSubmit = async (data: FormValues) => {
    const step3Data = {
      rating: data.rating,
      review: data.review,
    };
    const result = step3Schema.safeParse(step3Data);
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
    console.log("Step3 제출 데이터:", step3Data);
    router.push("/form/step4");
  };

  const errorStyle = (field: "rating" | "review") => 
    errors[field] 
    ? { border: "1px solid red", outline: "none" } 
    : { border: "1px solid #ccc"};

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
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
          style={{ ...errorStyle("rating"), borderRadius: "8px"}}
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
          rows={6}
          placeholder="이 책을 읽고 느낀 점을 자유롭게 작성해주세요."
          {...register("review")}
          style={{ 
            ...errorStyle("review"),
            resize: "vertical", 
            padding: "8px",
            borderRadius: "6px",
          }}
        />
        {errors.review && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.review.message}
          </span>
        )}
      </label>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/form/step2")}
          style={{
            background: '#f0f0f0',
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >이전 단계로 이동
        </button>

        <button type="submit"
        style={{
          background: '#0070f3',
          color: 'white',
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        >다음 단계로 이동</button>
      </div>
    </form>
  );
}
