import { z } from "zod";

export const quoteSchema = z.object({
  text: z.string().min(1, "인용구를 입력해주세요."),
  page: z
    .union([
      z
        .number({ message: "페이지 번호는 숫자만 입력 가능합니다." })
        .min(1, "페이지 번호는 1 이상이어야 합니다.")
        .int("페이지 번호는 정수만 입력 가능합니다."),
      z.nan().refine(() => false, {
        message: "페이지 번호는 숫자만 입력 가능합니다.",
      }),
    ])
    .optional(),
});

export const step4Schema = z
  .object({
    totalPages: z
      .number({ message: "총 페이지 수는 숫자여야 합니다." })
      .min(1, "총 페이지 수는 1 이상이어야 합니다."),
    quotes: z.array(quoteSchema).min(1, "인용구를 최소 1개 이상 입력해주세요."),
  })
  .superRefine((data, ctx) => {
    if (data.quotes.length > 1) {
      data.quotes.forEach((quote, index) => {
        if (!quote.page || quote.page === undefined || quote.page === null) {
          ctx.addIssue({
            code: "custom",
            message: "두 개 이상의 인용구가 있을 경우 페이지 번호는 필수 입력 항목입니다.",
            path: ["quotes", index, "page"],
          });
        }
      });
    }

    data.quotes.forEach((quote, index) => {
      if (quote.page !== undefined && quote.page !== null) {
        if (isNaN(quote.page)) {
          ctx.addIssue({
            code: "custom",
            message: "페이지 번호는 숫자만 입력 가능합니다.",
            path: ["quotes", index, "page"],
          });
        }
        
        if (quote.page < 1) {
          ctx.addIssue({
            code: "custom",
            message: "페이지 번호는 1 이상이어야 합니다.",
            path: ["quotes", index, "page"],
          });
        }
        
        if (quote.page >= data.totalPages) {
          ctx.addIssue({
            code: "custom",
            message: "인용구 페이지 번호는 도서 전체 페이지 수보다 작아야 합니다.",
            path: ["quotes", index, "page"],
          });
        }
      }
    });
  });

