import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import {
  createFormInput,
  listFormsByUserIdInput,
  type CreateFormInputType,
  type ListFormsByUserIdInputType,
} from "./model";

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
}

export default FormService;
