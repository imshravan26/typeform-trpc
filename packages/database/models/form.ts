import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formVisibilityEnum = pgEnum("form_visibility", [
  "public", // shown in explore/gallery
  "unlisted", // link-only, not listed publicly
]);

export const formProtectionModeEnum = pgEnum("form_protection_mode", [
  "none",
  "code", // static secret code
  "invite_only", // email invite + OTP
]);

export type FormSettings = {
  protectionMode: "none" | "code" | "invite_only";
  accessCode: string | null;
  allowedDomains: string[];
  responseLimit: number | null;
  allowMultipleSubmissions: boolean;
  expiresAt: string | null; // ISO string, easier in jsonb
  opensAt: string | null;
  isShuffled: boolean;
  showProgressBar: boolean;
  confirmationMessage: string;
  redirectUrl: string | null;
  notifyCreatorOnSubmit: boolean;
  sendConfirmationToRespondent: boolean;
  accentColor: string;
  darkMode: boolean;
  isTemplate: boolean;
  category: "feedback" | "survey" | "quiz" | "registration" | "other";
  estimatedCompletionTime: number | null;
};

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by")
    .references(() => usersTable.id)
    .notNull(),
  slug: varchar("slug", { length: 100 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  visibility: formVisibilityEnum("visibility").default("unlisted").notNull(),
  settings: jsonb("settings").$type<FormSettings>().default({
    protectionMode: "none",
    accessCode: null,
    allowedDomains: [],
    responseLimit: null,
    allowMultipleSubmissions: false,
    expiresAt: null,
    opensAt: null,
    isShuffled: false,
    showProgressBar: true,
    confirmationMessage: "Thanks for your response!",
    redirectUrl: null,
    notifyCreatorOnSubmit: true,
    sendConfirmationToRespondent: false,
    accentColor: "#6366f1",
    darkMode: false,
    isTemplate: false,
    category: "other",
    estimatedCompletionTime: null,
  }),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
