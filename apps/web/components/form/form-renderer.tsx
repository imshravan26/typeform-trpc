"use client";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Toggle } from "~/components/ui/toggle";
import { cn } from "~/lib/utils";
import { getInputType } from "~/lib/form-utils";
import type { FormField } from "~/types/form";

type Props = {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
};

export function FieldRenderer({ field, value, onChange, disabled, error }: Props) {
  const baseInputClass = cn(
    "transition-all duration-200",
    error && "border-destructive focus-visible:ring-destructive"
  );

  switch (field.type) {
    case "LONG_TEXT":
      return (
        <Textarea
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? undefined}
          disabled={disabled}
          rows={4}
          className={cn("resize-none", baseInputClass)}
        />
      );

    case "YES_NO":
      return (
        <div className="flex gap-3">
          {["yes", "no"].map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={cn(
                "flex-1 rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-all duration-150",
                value === opt
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              {opt === "yes" ? "👍  Yes" : "👎  No"}
            </button>
          ))}
        </div>
      );

    case "RATING": {
      const max = field.maxRating ?? 5;
      return (
        <div className="flex gap-2">
          {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(String(star))}
              className={cn(
                "text-2xl transition-transform duration-100 hover:scale-110",
                Number(value) >= star ? "text-amber-400" : "text-muted-foreground/30"
              )}
            >
              ★
            </button>
          ))}
        </div>
      );
    }

    case "SELECT":
      return (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger id={field.id} className={cn("w-full", baseInputClass)}>
            <SelectValue placeholder={field.placeholder ?? "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "MULTI_SELECT":
      return (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((opt) => {
            const selected = value.split(",").filter(Boolean).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                disabled={disabled}
                onClick={() => {
                  const current = value.split(",").filter(Boolean);
                  const next = selected
                    ? current.filter((v) => v !== opt)
                    : [...current, opt];
                  onChange(next.join(","));
                }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-all duration-150",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );

    default:
      return (
        <Input
          id={field.id}
          type={getInputType(field.type)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? undefined}
          disabled={disabled}
          className={baseInputClass}
        />
      );
  }
}