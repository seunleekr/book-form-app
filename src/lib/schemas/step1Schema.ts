import { z } from "zod";
import { FormValues } from "@/context/FormContext";

export const step1Schema = z
  .object({
    title: z.string().min(1, "도서 제목을 입력해주세요."),
    author: z.string().min(1, "도서 저자를 입력해주세요."),
    status: z.enum(["to_read", "reading", "finished", "on_hold", ""]).refine((val) => val !== "", {
      message: "독서 상태를 선택해주세요.",
    }),
    publishedDate: z.string().min(1, "도서 출판일을 입력해주세요."),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    recommended: z.boolean(),
    rating: z.number(),
    review: z.string().optional(),
    quotes: z.array(z.object({ text: z.string(), page: z.number().optional() })),
    totalPages: z.number(),
    isPublic: z.boolean(),
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

