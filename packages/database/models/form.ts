import { pgTable, uuid, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 55 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
