"use client";

import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { firstErrorPath } from "@/lib/formUtils";
import { FormValues } from "@/context/FormContext";
import { step1Schema } from "@/lib/schemas/step1Schema";

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

  const onSubmit = (data: FormValues) => {
    const result = step1Schema.safeParse({
      title: data.title,
      author: data.author,
      status: data.status,
      publishedDate: data.publishedDate,
      startDate: data.startDate,
      endDate: data.endDate,
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
    router.push("/form/step2");
  };

  const errorStyle = (hasErr: boolean) => ({
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
        <input {...register("title")} placeholder="도서 제목" style={errorStyle(!!errors.title)} />
        {errors.title && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.title.message}</span>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 저자
        <input {...register("author")} placeholder="도서 저자" style={errorStyle(!!errors.author)} />
        {errors.author && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.author.message}</span>
        )}
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        독서 상태
        <select {...register("status")} style={errorStyle(!!errors.status)}>
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
          style={errorStyle(!!errors.publishedDate)}
        />
        {errors.publishedDate && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.publishedDate.message}</span>
        )}
      </label>

      {status !== "to_read" && (
        <>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            독서 시작일
            <input type="date" {...register("startDate")} style={errorStyle(!!errors.startDate)} />
            {errors.startDate && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.startDate.message}</span>
            )}
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            독서 종료일
            <input type="date" {...register("endDate")} style={errorStyle(!!errors.endDate)} />
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
