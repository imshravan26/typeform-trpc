import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().nullable().describe("description of the form"),
  createdBy: z.string().describe("uuid of the user creating the form"),
});

export const listFormsByUserIdInput = z.object({
  userId: z.string().describe("uuid of the user whose forms should be listed"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;
export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;
