import { z } from "zod";

export const fieldTypeModel = z.enum(["TEXT", "EMAIL", "NUMBER", "YES_NO", "PASSWORD"]);

export const formResponseInputModel = z.object({
  formId: z.string().describe("id of the form whose responses should be fetched"),
});

export const formResponseFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
  title: z.string().describe("title of the form"),
  description: z.string().optional().nullable().describe("description of the form"),
  createdBy: z.string().describe("id of the user who created the form"),
  createdAt: z.date().optional().nullable().describe("created date of the form"),
  updatedAt: z.date().optional().nullable().describe("updated date of the form"),
  isPublished: z.boolean().describe("whether the form is published"),
});

export const formResponseFieldOutputModel = z.object({
  id: z.string().describe("id of the form field"),
  label: z.string().describe("label of the form field"),
  labelKey: z.string().describe("slug version of the field label"),
  type: fieldTypeModel.describe("type of the form field"),
  index: z.string().describe("index of the field in the form"),
});

export const formResponseAnswerOutputModel = z.object({
  formFieldId: z.string().describe("id of the submitted form field"),
  label: z.string().describe("label of the form field"),
  labelKey: z.string().describe("slug version of the field label"),
  type: fieldTypeModel.describe("type of the form field"),
  value: z.string().describe("submitted value of the form field"),
});

export const extraFormResponseAnswerOutputModel = z.object({
  formFieldId: z.string().describe("id of the submitted form field"),
  value: z.string().describe("submitted value of the form field"),
});

export const formResponseOutputModel = z.object({
  id: z.string().describe("id of the form submission"),
  formId: z.string().describe("id of the submitted form"),
  createdAt: z.date().optional().nullable().describe("created date of the form submission"),
  updatedAt: z.date().optional().nullable().describe("updated date of the form submission"),
  answers: z.array(formResponseAnswerOutputModel).describe("answers mapped to current fields"),
  extraAnswers: z
    .array(extraFormResponseAnswerOutputModel)
    .describe("answers for fields that are no longer part of the form"),
});

export const formFieldAnalyticsOutputModel = z.object({
  formFieldId: z.string().describe("id of the form field"),
  label: z.string().describe("label of the form field"),
  labelKey: z.string().describe("slug version of the field label"),
  type: fieldTypeModel.describe("type of the form field"),
  totalResponses: z.number().describe("total submissions for the form"),
  answeredCount: z.number().describe("number of submissions with an answer for this field"),
  skippedCount: z.number().describe("number of submissions without an answer for this field"),
  values: z
    .array(
      z.object({
        value: z.string().describe("submitted value"),
        count: z.number().describe("number of times this value was submitted"),
      }),
    )
    .describe("count of submitted values for this field"),
});

export const listFormResponsesOutputModel = z.object({
  form: formResponseFormOutputModel,
  fields: z.array(formResponseFieldOutputModel),
  responses: z.array(formResponseOutputModel),
});

export const getFormResponseAnalyticsOutputModel = z.object({
  form: formResponseFormOutputModel,
  totalFields: z.number().describe("total fields in the form"),
  totalResponses: z.number().describe("total submissions for the form"),
  latestResponseAt: z.date().optional().nullable().describe("latest response date"),
  fields: z.array(formFieldAnalyticsOutputModel),
  responses: z.array(formResponseOutputModel),
});
