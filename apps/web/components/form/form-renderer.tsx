"use client";
/* Enhanced: quiet editorial respondent input controls. */

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
    "font-mono transition-colors duration-150",
    error && "border-destructive focus-visible:ring-destructive",
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
          className={cn(
            "resize-none rounded-sm border-[var(--border)] bg-transparent focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[rgba(245,158,11,0.5)]",
            baseInputClass,
          )}
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
                "flex-1 rounded-sm border px-4 py-3 font-mono text-sm font-medium capitalize transition-colors duration-100",
                value === opt
                  ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                  : "border-[var(--border)] bg-transparent text-foreground hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]",
              )}
            >
              {opt === "yes" ? "Yes" : "No"}
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
                "font-mono text-2xl transition-colors duration-100",
                Number(value) >= star ? "text-[var(--accent)]" : "text-[var(--text-muted)]",
              )}
            >
              *
            </button>
          ))}
        </div>
      );
    }

    case "SELECT":
      return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={field.id}
            className={cn(
              "w-full rounded-sm border-[var(--border)] bg-transparent font-mono focus:ring-1 focus:ring-[rgba(245,158,11,0.5)]",
              baseInputClass,
            )}
          >
            <SelectValue placeholder={field.placeholder ?? "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
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
                  const next = selected ? current.filter((v) => v !== opt) : [...current, opt];
                  onChange(next.join(","));
                }}
                className={cn(
                  "rounded-sm border px-4 py-1.5 font-mono text-sm transition-colors duration-100",
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                    : "border-[var(--border)] bg-transparent text-foreground hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]",
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
          className={cn(
            "rounded-sm border-[var(--border)] bg-transparent focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[rgba(245,158,11,0.5)]",
            baseInputClass,
          )}
        />
      );
  }
}
