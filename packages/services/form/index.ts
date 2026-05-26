import { asc, db, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/formFields";
import { formsTable } from "@repo/database/models/form";
import { formSubmissionsTable } from "@repo/database/models/form-submissions";
import {
  createFieldInput,
  createFormInput,
  deleteFieldInput,
  getFieldInput,
  getFormWithFieldsInput,
  listFieldsByFormIdInput,
  listFormsByUserIdInput,
  updateFieldInput,
  createFormSubmissionInput,
  deleteFormSubmissionInput,
  getFormSubmissionInput,
  listFormSubmissionsByFormIdInput,
  type CreateFieldInputType,
  type CreateFormInputType,
  type CreateFormSubmissionInputType,
  type DeleteFormSubmissionInputType,
  type DeleteFieldInputType,
  type GetFieldInputType,
  type GetFormSubmissionInputType,
  type GetFormWithFieldsInputType,
  type ListFormSubmissionsByFormIdInputType,
  type ListFieldsByFormIdInputType,
  type ListFormsByUserIdInputType,
  type UpdateFieldInputType,
} from "./model";

const getLabelKey = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

class FormService {
  public async createForm(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const formInsertResult = await db
      .insert(formsTable)
      .values({
        title,
        description,
        createdBy,
      })
      .returning({
        id: formsTable.id,
      });

    if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id)
      throw new Error("something went wrong");

    return {
      id: formInsertResult[0].id,
    };
  }

  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return {
      forms,
    };
  }

  public async getFormWithFields(payload: GetFormWithFieldsInputType) {
    const { formId } = await getFormWithFieldsInput.parseAsync(payload);

    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          createdBy: formsTable.createdBy,
          createdAt: formsTable.createdAt,
          updatedAt: formsTable.updatedAt,
        },
        field: {
          id: formFieldsTable.id,
          label: formFieldsTable.label,
          labelKey: formFieldsTable.labelKey,
          description: formFieldsTable.description,
          placeholder: formFieldsTable.placeholder,
          isRequired: formFieldsTable.isRequired,
          index: formFieldsTable.index,
          type: formFieldsTable.type,
          formId: formFieldsTable.formId,
          createdAt: formFieldsTable.createdAt,
          updatedAt: formFieldsTable.updatedAt,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldsTable.index));

    if (!rows || rows.length === 0 || !rows[0]?.form) throw new Error("Form not found");

    const form = {
      ...rows[0].form,
      fields: rows.flatMap((row) => (row.field ? [row.field] : [])),
    };

    return {
      form,
    };
  }

  public async createField(payload: CreateFieldInputType) {
    const { label, description, placeholder, isRequired, index, type, formId } =
      await createFieldInput.parseAsync(payload);

    const fieldInsertResult = await db
      .insert(formFieldsTable)
      .values({
        label,
        labelKey: getLabelKey(label),
        description,
        placeholder,
        isRequired,
        index,
        type,
        formId,
      })
      .returning({
        id: formFieldsTable.id,
      });

    if (!fieldInsertResult || fieldInsertResult.length === 0 || !fieldInsertResult[0]?.id)
      throw new Error("something went wrong");

    return {
      id: fieldInsertResult[0].id,
    };
  }

  public async getField(payload: GetFieldInputType) {
    const { id } = await getFieldInput.parseAsync(payload);

    const field = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        placeholder: formFieldsTable.placeholder,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        formId: formFieldsTable.formId,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id));

    if (!field || field.length === 0 || !field[0]) throw new Error("Field not found");

    return {
      field: field[0],
    };
  }

  public async listFieldsByFormId(payload: ListFieldsByFormIdInputType) {
    const { formId } = await listFieldsByFormIdInput.parseAsync(payload);

    const fields = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        placeholder: formFieldsTable.placeholder,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        formId: formFieldsTable.formId,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.index));

    return {
      fields,
    };
  }

  public async updateField(payload: UpdateFieldInputType) {
    const { id, label, description, placeholder, isRequired, index, type } =
      await updateFieldInput.parseAsync(payload);

    const fieldUpdateResult = await db
      .update(formFieldsTable)
      .set({
        ...(label !== undefined
          ? {
              label,
              labelKey: getLabelKey(label),
            }
          : {}),
        ...(description !== undefined ? { description } : {}),
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(isRequired !== undefined ? { isRequired } : {}),
        ...(index !== undefined ? { index } : {}),
        ...(type !== undefined ? { type } : {}),
      })
      .where(eq(formFieldsTable.id, id))
      .returning({
        id: formFieldsTable.id,
      });

    if (!fieldUpdateResult || fieldUpdateResult.length === 0 || !fieldUpdateResult[0]?.id)
      throw new Error("Field not found");

    return {
      id: fieldUpdateResult[0].id,
    };
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { id } = await deleteFieldInput.parseAsync(payload);

    const fieldDeleteResult = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .returning({
        id: formFieldsTable.id,
      });

    if (!fieldDeleteResult || fieldDeleteResult.length === 0 || !fieldDeleteResult[0]?.id)
      throw new Error("Field not found");

    return {
      id: fieldDeleteResult[0].id,
    };
  }

  public async createFormSubmission(payload: CreateFormSubmissionInputType) {
    const { formId, values } = await createFormSubmissionInput.parseAsync(payload);

    const formSubmissionInsertResult = await db
      .insert(formSubmissionsTable)
      .values({
        formId,
        values,
      })
      .returning({
        id: formSubmissionsTable.id,
      });

    if (
      !formSubmissionInsertResult ||
      formSubmissionInsertResult.length === 0 ||
      !formSubmissionInsertResult[0]?.id
    )
      throw new Error("something went wrong");

    return {
      id: formSubmissionInsertResult[0].id,
    };
  }

  public async getFormSubmission(payload: GetFormSubmissionInputType) {
    const { id } = await getFormSubmissionInput.parseAsync(payload);

    const submission = await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
        updatedAt: formSubmissionsTable.updatedAt,
      })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.id, id));

    if (!submission || submission.length === 0 || !submission[0])
      throw new Error("Form submission not found");

    return {
      submission: submission[0],
    };
  }

  public async listFormSubmissionsByFormId(payload: ListFormSubmissionsByFormIdInputType) {
    const { formId } = await listFormSubmissionsByFormIdInput.parseAsync(payload);

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

    return {
      submissions,
    };
  }

  public async deleteFormSubmission(payload: DeleteFormSubmissionInputType) {
    const { id } = await deleteFormSubmissionInput.parseAsync(payload);

    const formSubmissionDeleteResult = await db
      .delete(formSubmissionsTable)
      .where(eq(formSubmissionsTable.id, id))
      .returning({
        id: formSubmissionsTable.id,
      });

    if (
      !formSubmissionDeleteResult ||
      formSubmissionDeleteResult.length === 0 ||
      !formSubmissionDeleteResult[0]?.id
    )
      throw new Error("Form submission not found");

    return {
      id: formSubmissionDeleteResult[0].id,
    };
  }
}

export default FormService;
