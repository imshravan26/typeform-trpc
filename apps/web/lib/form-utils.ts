import type { FieldType, FormField } from "~/types/form";

export function sortFieldsByIndex(fields: FormField[]): FormField[] {
  return [...fields].sort((a, b) => Number(a.index) - Number(b.index));
}

export function getInputType(type: FieldType): React.HTMLInputTypeAttribute {
  switch (type) {
    case "EMAIL":
      return "email";
    case "NUMBER":
      return "number";
    case "PASSWORD":
      return "password";
    case "DATE":
      return "date";
    default:
      return "text";
  }
}

export function isTextLike(type: FieldType): boolean {
  return ["TEXT", "EMAIL", "NUMBER", "PASSWORD", "DATE"].includes(type);
}

export function validateField(field: FormField, value: string): string | null {
  if (field.isRequired && !value.trim()) {
    return `${field.label} is required`;
  }
  if (field.type === "EMAIL" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address";
  }
  if (field.type === "NUMBER" && value && isNaN(Number(value))) {
    return "Enter a valid number";
  }
  return null;
}
