import { z } from "zod";

export const step2Schema = z.object({
  recommended: z.boolean().refine((val) => val, { message: "이 도서를 추천 하시겠습니까?" }),
  rating: z
    .number({ message: "별점은 숫자여야 합니다." })
    .min(0, "별점은 0점 이상이어야 합니다.") 
    .max(5, "별점은 5점 이하여야 합니다."),
});

