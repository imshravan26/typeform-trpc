import { asc, db, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/formFields";
import { formsTable } from "@repo/database/models/form";
import {
  formSubmissionsTable,
  type FormSubmissionValueRow,
} from "@repo/database/models/form-submissions";
import {
  getFormResponseAnalyticsInput,
  listFormResponsesInput,
  type GetFormResponseAnalyticsInputType,
  type ListFormResponsesInputType,
} from "./model";

type FormField = {
  id: string;
  label: string;
  labelKey: string;
  type: "TEXT" | "EMAIL" | "NUMBER" | "YES_NO" | "PASSWORD";
  index: string;
};

type FormSubmission = {
  id: string;
  formId: string;
  values: FormSubmissionValueRow | null;
  createdAt: Date;
  updatedAt: Date;
};

class FormResponseService {
  private async getCreatorForm(formId: string, userId: string) {
    const form = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        isPublished: formsTable.isPublished,
      })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form || form.length === 0 || !form[0]) throw new Error("Form not found");
    if (form[0].createdBy !== userId) throw new Error("User does not own this form");

    return form[0];
  }

  private async listFields(formId: string) {
    const fields = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        type: formFieldsTable.type,
        index: formFieldsTable.index,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.index));

    return fields;
  }

  private async listSubmissions(formId: string) {
    const submissions = await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
        updatedAt: formSubmissionsTable.updatedAt,
      })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .orderBy(asc(formSubmissionsTable.createdAt));

    return submissions;
  }

  private getResponseRows(fields: FormField[], submissions: FormSubmission[]) {
    const fieldById = new Map(fields.map((field) => [field.id, field]));

    return submissions.map((submission) => {
      const valueByFieldId = new Map(
        (submission.values ?? []).map((value) => [value.formFieldId, value.value]),
      );

      return {
        id: submission.id,
        formId: submission.formId,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        answers: fields.map((field) => ({
          formFieldId: field.id,
          label: field.label,
          labelKey: field.labelKey,
          type: field.type,
          value: valueByFieldId.get(field.id) ?? "",
        })),
        extraAnswers: (submission.values ?? [])
          .filter((value) => !fieldById.has(value.formFieldId))
          .map((value) => ({
            formFieldId: value.formFieldId,
            value: value.value,
          })),
      };
    });
  }

  private getFieldAnalytics(fields: FormField[], submissions: FormSubmission[]) {
    return fields.map((field) => {
      const valueCounts = new Map<string, number>();
      let answeredCount = 0;

      submissions.forEach((submission) => {
        const value = (submission.values ?? []).find(
          (answer) => answer.formFieldId === field.id,
        )?.value;

        if (!value) return;

        answeredCount += 1;
        valueCounts.set(value, (valueCounts.get(value) ?? 0) + 1);
      });

      return {
        formFieldId: field.id,
        label: field.label,
        labelKey: field.labelKey,
        type: field.type,
        totalResponses: submissions.length,
        answeredCount,
        skippedCount: submissions.length - answeredCount,
        values: Array.from(valueCounts.entries()).map(([value, count]) => ({
          value,
          count,
        })),
      };
    });
  }

  public async listFormResponses(payload: ListFormResponsesInputType) {
    const { formId, userId } = await listFormResponsesInput.parseAsync(payload);

    const form = await this.getCreatorForm(formId, userId);
    const fields = await this.listFields(formId);
    const submissions = await this.listSubmissions(formId);

    return {
      form,
      fields,
      responses: this.getResponseRows(fields, submissions),
    };
  }

  public async getFormResponseAnalytics(payload: GetFormResponseAnalyticsInputType) {
    const { formId, userId } = await getFormResponseAnalyticsInput.parseAsync(payload);

    const form = await this.getCreatorForm(formId, userId);
    const fields = await this.listFields(formId);
    const submissions = await this.listSubmissions(formId);

    return {
      form,
      totalFields: fields.length,
      totalResponses: submissions.length,
      latestResponseAt: submissions.at(-1)?.createdAt ?? null,
      fields: this.getFieldAnalytics(fields, submissions),
      responses: this.getResponseRows(fields, submissions),
    };
  }
}

export default FormResponseService;
