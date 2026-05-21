import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().nullable().describe("description of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the created form"),
});

export const listFormsInputModel = z.undefined();

export const listFormsOutputModel = z.object({
  forms: z.array(
    z.object({
      id: z.string().describe("id of the form"),
      title: z.string().describe("title of the form"),
      description: z.string().optional().nullable().describe("description of the form"),
      createdBy: z.string().describe("id of the user who created the form"),
      createdAt: z.date().optional().nullable().describe("created date of the form"),
      updatedAt: z.date().optional().nullable().describe("updated date of the form"),
    }),
  ),
});
