import { z } from "zod";

export const step5Schema = z.object({
  isPublic: z.boolean(),
});

