export type FieldType =
  | "TEXT"
  | "EMAIL"
  | "NUMBER"
  | "YES_NO"
  | "PASSWORD"
  | "LONG_TEXT"
  | "SELECT"
  | "MULTI_SELECT"
  | "RATING"
  | "DATE";

export type FormField = {
  id: string;
  label: string;
  labelKey: string;
  description: string | null;
  placeholder: string | null;
  isRequired: boolean | null | undefined;
  index: string;
  type: FieldType;
  options?: string[]; // for SELECT / MULTI_SELECT
  maxRating?: number; // for RATING, default 5
};

export type FormMeta = {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
};

export type SubmissionValue = {
  formFieldId: string;
  value: string;
};
