import { z } from "zod";

export const validationSchema = z.object({
  search: z.string().optional(),
  date: z.string().optional(),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "A file is required")
    .refine(
      (files) => files[0]?.size <= 30 * 1024 * 1024,
      "File size should not exceed 25MB"
    ),
});

export type validationSchemaType = z.infer<typeof validationSchema>;
