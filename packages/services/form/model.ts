import { z } from "zod";

export const fieldType = z.enum(["TEXT", "EMAIL", "NUMBER", "YES_NO", "PASSWORD"]);

export const createFormInput = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().nullable().describe("description of the form"),
  createdBy: z.string().describe("uuid of the user creating the form"),
});

export const listFormsByUserIdInput = z.object({
  userId: z.string().describe("uuid of the user whose forms should be listed"),
});

export const getFormWithFieldsInput = z.object({
  formId: z.string().describe("uuid of the form to get with its fields"),
});

export const createFieldInput = z.object({
  label: z.string().min(1).max(255).describe("label of the field"),
  description: z.string().optional().nullable().describe("description of the field"),
  placeholder: z.string().optional().nullable().describe("placeholder of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  index: z.string().describe("index of the field in the form"),
  type: fieldType.describe("type of the field"),
  formId: z.string().describe("uuid of the form this field belongs to"),
});

export const updateFieldInput = z.object({
  id: z.string().describe("uuid of the field to update"),
  label: z.string().min(1).max(255).optional().describe("label of the field"),
  description: z.string().optional().nullable().describe("description of the field"),
  placeholder: z.string().optional().nullable().describe("placeholder of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  index: z.string().optional().describe("index of the field in the form"),
  type: fieldType.optional().describe("type of the field"),
});

export const deleteFieldInput = z.object({
  id: z.string().describe("uuid of the field to delete"),
});

export const getFieldInput = z.object({
  id: z.string().describe("uuid of the field to get"),
});

export const listFieldsByFormIdInput = z.object({
  formId: z.string().describe("uuid of the form whose fields should be listed"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;
export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;
export type GetFormWithFieldsInputType = z.infer<typeof getFormWithFieldsInput>;
export type CreateFieldInputType = z.infer<typeof createFieldInput>;
export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;
export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;
export type GetFieldInputType = z.infer<typeof getFieldInput>;
export type ListFieldsByFormIdInputType = z.infer<typeof listFieldsByFormIdInput>;
