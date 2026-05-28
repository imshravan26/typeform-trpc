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
  jsonb,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type", [
  "TEXT",
  "LONG_TEXT",
  "EMAIL",
  "NUMBER",
  "YES_NO",
  "SELECT",
  "MULTI_SELECT",
  "RATING",
  "DATE",
  "PASSWORD",
]);

export type FieldConfig = {
  options?: string[]; // SELECT / MULTI_SELECT
  maxRating?: number; // RATING (default 5)
  minValue?: number; // NUMBER
  maxValue?: number;
  maxLength?: number; // TEXT / LONG_TEXT
};

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    label: varchar("label", { length: 255 }).notNull(),
    labelKey: varchar("label_key", { length: 255 }).notNull(),
    description: text("description"),
    placeholder: text("placeholder"),
    isRequired: boolean("is_required").default(false).notNull(),
    index: numeric("index", { scale: 2 }).notNull(),
    formId: uuid("form_id")
      .references(() => formsTable.id)
      .notNull(),
    type: fieldTypeEnum("type").notNull(),
    config: jsonb("config").$type<FieldConfig>().default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      uniqueFormIdandIndex: unique().on(table.formId, table.index),
    };
  },
);
