"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const step2Schema = z.object({
    recommended: z.boolean(),
    rating: z.number()
        .min(0, "별점은 0점 이상이어야 합니다.") 
        .max(5, "별점은 5점 이하여야 합니다."),
});

type Step2Values = z.infer<typeof step2Schema>;

export default function Step2Form() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Step2Values>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            recommended: false,
            rating: 0,
        },
    });

    const rating = watch("rating");
    const recommended = watch("recommended");

    const onSubmit = (data: Step2Values) => {
        console.log("Step2 제출 데이터:", data);
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

        <label style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <input
         type="checkbox"
         {...register("recommended")}
         checked={recommended}
         onChange={(e) => setValue("recommended", e.target.checked)}
        />
        이 도서를 추천 하시겠습니까?
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            별점: {rating} /5
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
        
        <button type="submit">다음</button>
        </form>
    );
}