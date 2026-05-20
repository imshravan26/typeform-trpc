import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  unique,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum", [
  "TEXT",
  "EMAIL",
  "NUMBER",
  "YES_NO",
  "PASSWORD",
]);

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    label: varchar("label", { length: 255 }).notNull(),
    labelKey: varchar("label_key", { length: 255 }).notNull(),
    description: text("description"),
    placeholder: text("placeholder"),
    isRequired: boolean("is_required").default(false),
    index: numeric("index", { scale: 2 }).notNull(),
    type: fieldTypeEnum("type").notNull(),
    formId: uuid("form_id")
      .references(() => formsTable.id)
      .notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      uniqueFormIdandIndex: unique().on(table.formId, table.index),
    };
  },
);
