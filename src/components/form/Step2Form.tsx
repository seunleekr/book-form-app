"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { firstErrorPath } from "@/lib/formUtils";
import { FormValues } from "@/context/FormContext";

const step2Schema = z.object({
    recommended: z.boolean().refine((val) => val, { message: "이 도서를 추천 하시겠습니까?" }),
    rating: z
        .number({ message: "별점은 숫자여야 합니다." })
        .min(0, "별점은 0점 이상이어야 합니다.") 
        .max(5, "별점은 5점 이하여야 합니다."),
});

export default function Step2Form() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setFocus,
        setError,
        formState: { errors },
    } = useFormContext<FormValues>();

    const rating = watch("rating");
    const recommended = watch("recommended");

    const onInvalid = () => {
        const firstError = firstErrorPath(errors);
        if (firstError) setFocus(firstError as any);
    };

    const onSubmit = async (data: FormValues) => {
        const step2Data = {
            recommended: data.recommended,
            rating: data.rating,
        };
        const result = step2Schema.safeParse(step2Data);
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
            
            const firstError = firstErrorPath(result.error.flatten().fieldErrors);
            if (firstError) setFocus(firstError as any);
            return;
        }
        console.log("Step2 제출 데이터:", step2Data);
        router.push("/form/step3");
    };

    const errStyle = (hasErr: boolean) => ({
        border: "1px solid",
        borderColor: hasErr ? "red" : "#ccc",
        borderRadius: "6px",
        padding: "8px",
    });

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

        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
         type="checkbox"
         {...register("recommended")} 
         checked={recommended}
         onChange={(e) => setValue("recommended", e.target.checked)}
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
             style={errStyle(!!errors.rating)}
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
          >이전 단계로 이동
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
          >다음 단계로 이동
          </button>
        </div>
        </form>
    );
}