import { z } from "zod";

export const getFormResponseAnalyticsInput = z.object({
  formId: z.string().describe("uuid of the form whose responses should be analyzed"),
  userId: z.string().describe("uuid of the user who owns the form"),
});

export const listFormResponsesInput = z.object({
  formId: z.string().describe("uuid of the form whose responses should be listed"),
  userId: z.string().describe("uuid of the user who owns the form"),
});

export type GetFormResponseAnalyticsInputType = z.infer<typeof getFormResponseAnalyticsInput>;
export type ListFormResponsesInputType = z.infer<typeof listFormResponsesInput>;
