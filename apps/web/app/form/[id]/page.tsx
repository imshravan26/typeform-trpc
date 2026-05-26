"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCreateFormSubmission, useFormWithFields } from "~/hooks/api/forms";

type FieldType = "TEXT" | "EMAIL" | "NUMBER" | "YES_NO" | "PASSWORD";

type FormField = {
  id: string;
  label: string;
  labelKey: string;
  description: string | null;
  placeholder: string | null;
  isRequired: boolean | null | undefined;
  index: string;
  type: FieldType;
};

function sortFieldsByIndex(fields: FormField[]) {
  return [...fields].sort((a, b) => Number(a.index) - Number(b.index));
}

function getInputType(type: FieldType) {
  switch (type) {
    case "EMAIL":
      return "email";
    case "NUMBER":
      return "number";
    case "PASSWORD":
      return "password";
    default:
      return "text";
  }
}

export default function PublicFormPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const { form, fields, error, isLoading } = useFormWithFields(formId);
  const { createFormSubmissionAsync, isPending: isSubmitting } = useCreateFormSubmission();
  const [values, setValues] = useState<Record<string, string>>({});

  const sortedFields = useMemo(
    () => sortFieldsByIndex(fields as FormField[]),
    [fields],
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missingRequiredField = sortedFields.find(
      (field) => field.isRequired && !values[field.id]?.trim(),
    );

    if (missingRequiredField) {
      toast.error(`Answer "${missingRequiredField.label}" before submitting`);
      return;
    }

    try {
      await createFormSubmissionAsync({
        formId,
        values: sortedFields.map((field) => ({
          formFieldId: field.id,
          value: values[field.id] ?? "",
        })),
      });

      toast.success("Form submitted");
      setValues({});
    } catch {
      toast.error("Failed to submit form");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading form...</p>
      </main>
    );
  }

  if (error || !form) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          {error?.message ?? "Form not found."}
        </p>
      </main>
    );
  }

  if (!form.isPublished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            <CardDescription>This form is currently closed for submissions.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          {form.description ? (
            <CardDescription>{form.description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {sortedFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">This form has no fields yet.</p>
            ) : (
              sortedFields.map((field) => (
                <div key={field.id} className="grid gap-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.isRequired ? (
                      <span className="text-destructive"> *</span>
                    ) : null}
                  </Label>
                  {field.description ? (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  ) : null}

                  {field.type === "YES_NO" ? (
                    <Select
                      value={values[field.id] ?? ""}
                      onValueChange={(value) => handleFieldChange(field.id, value)}
                      required={Boolean(field.isRequired)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id={field.id} className="w-full">
                        <SelectValue placeholder={field.placeholder ?? "Select an answer"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.id}
                      type={getInputType(field.type)}
                      value={values[field.id] ?? ""}
                      onChange={(event) => handleFieldChange(field.id, event.target.value)}
                      placeholder={field.placeholder ?? undefined}
                      required={Boolean(field.isRequired)}
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              ))
            )}

            <Button type="submit" disabled={sortedFields.length === 0 || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
