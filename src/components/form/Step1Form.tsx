"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { firstErrorPath } from "@/lib/formUtils";
import { FormValues } from "@/context/FormContext";

const step1Schema = z
  .object({
    title: z.string().min(1, "도서 제목을 입력해주세요."),
    author: z.string().min(1, "도서 저자를 입력해주세요."),
    status: z.string().min(1, "독서 상태를 선택해주세요."),
    publishedDate: z.string().min(1, "도서 출판일을 입력해주세요."),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { status, startDate, endDate, publishedDate } = data;

    if (status === "to_read" && (startDate || endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "'읽고 싶은 책' 상태에서는 날짜를 입력할 수 없습니다.",
        path: ["startDate"],
      });
    }

    if (status === "reading") {
      if (!startDate) {
        ctx.addIssue({
          code: "custom",
          message: "'읽는 중' 상태에서는 시작일을 입력해야 합니다.",
          path: ["startDate"],
        });
      } else if (publishedDate && startDate < publishedDate) {
        ctx.addIssue({
          code: "custom",
          message: "독서 시작일은 도서 출판일 이후여야 합니다.",
          path: ["startDate"],
        });
      }
      if (endDate) {
        ctx.addIssue({
          code: "custom",
          message: "'읽는 중' 상태에서는 종료일을 입력할 수 없습니다.",
          path: ["endDate"],
        });
      }
    }

    if (status === "finished") {
      if (!startDate) {
        ctx.addIssue({
          code: "custom",
          message: "'읽음' 상태에서는 시작일을 입력해야 합니다.",
          path: ["startDate"],
        });
      }
      if (!endDate) {
        ctx.addIssue({
          code: "custom",
          message: "'읽음' 상태에서는 종료일을 입력해야 합니다.",
          path: ["endDate"],
        });
      }
      if (startDate && endDate) {
        if (startDate > endDate) {
          ctx.addIssue({
            code: "custom",
            message: "시작일은 종료일보다 이후일 수 없습니다.",
            path: ["startDate"],
          });
        }
        if (publishedDate && startDate < publishedDate) {
          ctx.addIssue({
            code: "custom",
            message: "독서 시작일은 도서 출판일 이후여야 합니다.",
            path: ["startDate"],
          });
        }
      }
    }

    if (status === "on_hold") {
      if (!startDate) {
        ctx.addIssue({
          code: "custom",
          message: "'보류 중' 상태에서는 시작일을 입력해야 합니다.",
          path: ["startDate"],
        });
      } else if (publishedDate && startDate < publishedDate) {
        ctx.addIssue({
          code: "custom",
          message: "독서 시작일은 도서 출판일 이후여야 합니다.",
          path: ["startDate"],
        });
      }
      if (endDate) {
        ctx.addIssue({
          code: "custom",
          message: "'보류 중' 상태에서는 종료일을 입력할 수 없습니다.",
          path: ["endDate"],
        });
      }
    }
  });

export default function Step1Form() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    setError,
    formState: { errors },
  } = useFormContext<FormValues>();

  const status = watch("status");

  const onInvalid = () => {
    const firstError = firstErrorPath(errors);
    if (firstError) setFocus(firstError as any);
  };

  const onSubmit = async (data: FormValues) => {
    const step1Data = {
      title: data.title,
      author: data.author,
      status: data.status,
      publishedDate: data.publishedDate,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    const result = step1Schema.safeParse(step1Data);
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
    console.log("✅ Step1 제출 데이터:", step1Data);
    router.push("/form/step2");
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
      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 제목
        <input {...register("title")} placeholder="도서 제목" style={errStyle(!!errors.title)} />
        {errors.title && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.title.message}</span>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 저자
        <input {...register("author")} placeholder="도서 저자" style={errStyle(!!errors.author)} />
        {errors.author && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.author.message}</span>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        독서 상태
        <select {...register("status")} style={errStyle(!!errors.status)}>
          <option value="">독서 상태 선택</option>
          <option value="to_read">읽고 싶은 책</option>
          <option value="reading">읽는 중</option>
          <option value="finished">읽음</option>
          <option value="on_hold">보류 중</option>
        </select>
        {errors.status && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.status.message}</span>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 출판일
        <input
          type="date"
          {...register("publishedDate")}
          style={errStyle(!!errors.publishedDate)}
        />
        {errors.publishedDate && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.publishedDate.message}</span>
        )}
      </label>

      {status !== "to_read" && (
        <>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            독서 시작일
            <input type="date" {...register("startDate")} style={errStyle(!!errors.startDate)} />
            {errors.startDate && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.startDate.message}</span>
            )}
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            독서 종료일
            <input type="date" {...register("endDate")} style={errStyle(!!errors.endDate)} />
            {errors.endDate && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.endDate.message}</span>
            )}
          </label>
        </>
      )}

      <button type="submit">다음</button>
    </form>
  );
}
