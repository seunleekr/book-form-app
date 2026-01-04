"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { FormValues } from "@/context/FormContext";
import { step2Schema } from "@/lib/schemas/step2Schema";
import { errorStyle } from "@/lib/utils/formStyles";

export default function Step2Form() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext<FormValues>();

  const rating = watch("rating");
  const recommended = watch("recommended");

  const onSubmit = (data: FormValues) => {
    const result = step2Schema.safeParse({
      recommended: data.recommended,
      rating: data.rating,
    });
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
      return;
    }
    router.push("/form/step3");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        marginTop: "20px",
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          {...register("recommended")}
          checked={recommended}
          onChange={(event) => setValue("recommended", event.target.checked)}
        />
        이 도서를 추천 하시겠습니까?
      </label>
      {errors.recommended && (
        <span style={{ color: "red", fontSize: "12px" }}>
          {errors.recommended.message}
        </span>
      )}

      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        별점: {rating} /5
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          {...register("rating", { valueAsNumber: true })}
          style={errorStyle(!!errors.rating)}
        />
        {errors.rating && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.rating.message}
          </span>
        )}
      </label>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/form/step1")}
          style={{
            background: '#f0f0f0',
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          이전 단계로 이동
        </button>
        
        <button
          type="submit"
          style={{
            background: '#0070f3',
            color: 'white',
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          다음 단계로 이동
        </button>
      </div>
    </form>
  );
}