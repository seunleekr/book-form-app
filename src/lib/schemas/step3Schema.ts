import { z } from "zod";

export const step3Schema = z
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

