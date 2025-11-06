"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 유효성 검증 
const step1Schema = z.
object({
 title: z.string().min(1, "도서 제목을 입력해주세요."),
 author: z.string().min(1, "도서 저자를 입력해주세요."),
 status: z.string().min(1, "독서 상태를 선택해주세요."),
 startDate: z.string().min(1, "독서 시작일을 선택해주세요."),
 endDate: z.string().min(1, "독서 종료일을 선택해주세요."),
})
.superRefine((data, ctx) => {
  const { status, startDate, endDate } = data;

  if (status === "to_read") {
    if (startDate || endDate) {
      ctx.addIssue({
        code: "custom",
        message: "'읽고 싶은 책' 상태에서는 날짜를 입력할 수 없습니다.",
        path: ["startDate"],
      });
    }
  } 

if (status === "reading") {
  if (!startDate) {
    ctx.addIssue({
      code: "custom",
      message: "'읽는 중' 상태에서는 시작일을 입력해야 합니다.",
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
    if (!startDate || !endDate) {
      ctx.addIssue({
        code: "custom",
        message: "'읽음' 상태에서는 시작일과 종료일을 입력해야 합니다.",
        path: ["endDate"],
      });
    } else if (startDate > endDate) {
      ctx.addIssue({
        code: "custom",
        message: "시작일은 종료일보다 이후일 수 없습니다.",
        path: ["startDate"],
      });
    }
  }

  if (status === "on_hold") {
    if (!startDate) {
      ctx.addIssue({
        code: "custom",
        message: "'보류 중' 상태에서는 시작일을 입력해야 합니다.",
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

// 타입 생성
type Step1Values = z.infer<typeof step1Schema>;

export default function Step1Form() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: "",
      author: "",
      status: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data: Step1Values) => {
    console.log("Step1 제출 데이터:", data);
  };

  const status = watch("status");

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
      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 제목
        <input {...register("title")} placeholder="도서 제목" />
        {errors.title && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.title.message}
            </span>
        )}
        </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        도서 저자
        <input {...register("author")} placeholder="도서 저자" />
        {errors.author && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.author.message}
            </span>
        )}
        </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        독서 상태
        <select {...register("status")}>
          <option value="">독서 상태 선택</option>
          <option value="to_read">읽고 싶은 책</option>
          <option value="reading">읽는 중</option>
          <option value="finished">읽음</option>
          <option value="on_hold">보류 중</option>
        </select>
        {errors.status && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.status.message}
            </span>
        )}
        </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        독서 시작일
        <input type="date" {...register("startDate")} />
        {errors.startDate && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.startDate.message}
            </span>
        )}
        </label>

      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        독서 종료일
        <input type="date" {...register("endDate")} />
        {errors.endDate && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.endDate.message}
            </span>
        )}
        </label>

      <button type="submit">다음</button>
    </form>
  );
}