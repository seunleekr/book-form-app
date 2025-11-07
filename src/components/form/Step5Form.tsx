"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormValues } from "@/context/FormContext";

const step5Schema = z.object({
    isPublic: z.boolean(),
});

export default function Step5Form() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useFormContext<FormValues>();

    const isPublic = watch("isPublic");

    const onSubmit = async (data: FormValues) => {
        const step5Data = {
            isPublic: data.isPublic,
        };
        const result = step5Schema.safeParse(step5Data);
        if (!result.success) {
            return;
        }
        console.log("최종 제출 데이터:", data);
        alert("제출이 완료되었습니다.");
        router.push("/form/complete");
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
            <input type="checkbox" {...register("isPublic")} />
            {isPublic ? "공개 상태" : "비공개 상태"}
            </label>

        {errors.isPublic && (
            <span style={{ color: "red", fontSize: "12px" }}>
                {errors.isPublic.message}
            </span>
        )}

        <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
        }}
      >

        <button 
        type="button"
        onClick={() => router.push("/form/step4")}
        style={{
          background: '#e5e7eb',
          color: '#111',
          padding: '8px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
        >이전 단계로 이동</button>

        <button 
        type="submit"
        style={{
          background: '#10b981',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
        >
            제출 완료
        </button>
      </div>
    </form>
    );
}