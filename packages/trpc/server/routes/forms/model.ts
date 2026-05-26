import { z } from "zod";

export const fieldTypeModel = z.enum(["TEXT", "EMAIL", "NUMBER", "YES_NO", "PASSWORD"]);

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

export const getFormWithFieldsInputModel = z.object({
  formId: z.string().describe("id of the form to get"),
});

export const createFieldInputModel = z.object({
  label: z.string().min(1).max(255).describe("label of the field"),
  description: z.string().optional().nullable().describe("description of the field"),
  placeholder: z.string().optional().nullable().describe("placeholder of the field"),
  isRequired: z.boolean().default(false).describe("whether the field is required"),
  index: z.string().describe("index of the field in the form"),
  type: fieldTypeModel.describe("type of the field"),
  formId: z.string().describe("id of the form this field belongs to"),
});

export const createFieldOutputModel = z.object({
  id: z.string().describe("id of the created field"),
});

export const getFieldInputModel = z.object({
  id: z.string().describe("id of the field to get"),
});

export const fieldOutputModel = z.object({
  id: z.string().describe("id of the field"),
  label: z.string().describe("label of the field"),
  labelKey: z.string().describe("slug version of the field label"),
  description: z.string().optional().nullable().describe("description of the field"),
  placeholder: z.string().optional().nullable().describe("placeholder of the field"),
  isRequired: z.boolean().optional().nullable().describe("whether the field is required"),
  index: z.string().describe("index of the field in the form"),
  type: fieldTypeModel.describe("type of the field"),
  formId: z.string().describe("id of the form this field belongs to"),
  createdAt: z.date().optional().nullable().describe("created date of the field"),
  updatedAt: z.date().optional().nullable().describe("updated date of the field"),
});

export const getFieldOutputModel = z.object({
  field: fieldOutputModel,
});

export const listFieldsInputModel = z.object({
  formId: z.string().describe("id of the form whose fields should be listed"),
});

export const listFieldsOutputModel = z.object({
  fields: z.array(fieldOutputModel),
});

export const getFormWithFieldsOutputModel = z.object({
  form: z.object({
    id: z.string().describe("id of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().optional().nullable().describe("description of the form"),
    createdBy: z.string().describe("id of the user who created the form"),
    createdAt: z.date().optional().nullable().describe("created date of the form"),
    updatedAt: z.date().optional().nullable().describe("updated date of the form"),
    fields: z.array(fieldOutputModel),
  }),
});

export const updateFieldInputModel = z.object({
  id: z.string().describe("id of the field to update"),
  label: z.string().min(1).max(255).optional().describe("label of the field"),
  description: z.string().optional().nullable().describe("description of the field"),
  placeholder: z.string().optional().nullable().describe("placeholder of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  index: z.string().optional().describe("index of the field in the form"),
  type: fieldTypeModel.optional().describe("type of the field"),
});

export const updateFieldOutputModel = z.object({
  id: z.string().describe("id of the updated field"),
});

export const deleteFieldInputModel = z.object({
  id: z.string().describe("id of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("id of the deleted field"),
});

export const formSubmissionValueModel = z.object({
  formFieldId: z.string().describe("id of the submitted form field"),
  value: z.string().describe("submitted value of the form field"),
});

export const createFormSubmissionInputModel = z.object({
  formId: z.string().describe("id of the form being submitted"),
  values: z.array(formSubmissionValueModel).describe("submitted form values"),
});

export const createFormSubmissionOutputModel = z.object({
  id: z.string().describe("id of the created form submission"),
});

export const getFormSubmissionInputModel = z.object({
  id: z.string().describe("id of the form submission to get"),
});

export const formSubmissionOutputModel = z.object({
  id: z.string().describe("id of the form submission"),
  formId: z.string().describe("id of the submitted form"),
  values: z.array(formSubmissionValueModel).optional().nullable().describe("submitted form values"),
  createdAt: z.date().optional().nullable().describe("created date of the form submission"),
  updatedAt: z.date().optional().nullable().describe("updated date of the form submission"),
});

export const getFormSubmissionOutputModel = z.object({
  submission: formSubmissionOutputModel,
});

export const listFormSubmissionsInputModel = z.object({
  formId: z.string().describe("id of the form whose submissions should be listed"),
});

export const listFormSubmissionsOutputModel = z.object({
  submissions: z.array(formSubmissionOutputModel),
});

export const deleteFormSubmissionInputModel = z.object({
  id: z.string().describe("id of the form submission to delete"),
});

export const deleteFormSubmissionOutputModel = z.object({
  id: z.string().describe("id of the deleted form submission"),
});
