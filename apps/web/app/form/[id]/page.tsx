"use client";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormProgress } from "~/components/form/form-progressbar";
import { FieldRenderer } from "~/components/form/form-renderer";
import { ThankYouScreen } from "~/components/form/thank-u-screen";
import { sortFieldsByIndex, validateField } from "~/lib/form-utils";
import { useCreateFormSubmission, useFormWithFields } from "~/hooks/api/forms";
import type { FormField } from "~/types/form";

type Direction = 1 | -1;

const slideVariants = {
  enter: (dir: Direction) => ({
    y: dir === 1 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (dir: Direction) => ({
    y: dir === 1 ? -40 : 40,
    opacity: 0,
  }),
};

export default function PublicFormPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;

  const { form, fields, error, isLoading } = useFormWithFields(formId);
  const { createFormSubmissionAsync, isPending: isSubmitting } = useCreateFormSubmission();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const sortedFields = useMemo(() => sortFieldsByIndex(fields as FormField[]), [fields]);

  const currentField = sortedFields[currentIndex];
  const isLastField = currentIndex === sortedFields.length - 1;
  const isRequired = Boolean(currentField?.isRequired);

  const handleChange = useCallback(
    (value: string) => {
      if (!currentField) return;
      setValues((prev) => ({ ...prev, [currentField.id]: value }));
      setErrors((prev) => ({ ...prev, [currentField.id]: null }));
    },
    [currentField],
  );

  const goNext = useCallback(() => {
    if (!currentField) return;
    const error = validateField(currentField, values[currentField.id] ?? "");
    if (error) {
      setErrors((prev) => ({ ...prev, [currentField.id]: error }));
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, sortedFields.length - 1));
  }, [currentField, values, sortedFields.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleSkip = useCallback(() => {
    if (!currentField || isRequired) return;
    setValues((prev) => ({ ...prev, [currentField.id]: "" }));
    setDirection(1);
    setCurrentIndex((i) => Math.min(i + 1, sortedFields.length - 1));
  }, [currentField, isRequired, sortedFields.length]);

  const handleSubmit = useCallback(async () => {
    if (!currentField) return;
    const error = validateField(currentField, values[currentField.id] ?? "");
    if (error) {
      setErrors((prev) => ({ ...prev, [currentField.id]: error }));
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
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  }, [currentField, values, createFormSubmissionAsync, formId, sortedFields]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        isLastField ? handleSubmit() : goNext();
      }
    },
    [isLastField, handleSubmit, goNext],
  );

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading form…</p>
        </div>
      </main>
    );
  }

  // ── Error / not found ────────────────────────────────────
  if (error || !form) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Form not found</CardTitle>
            <CardDescription>
              {error?.message ?? "This form doesn't exist or has been removed."}
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  // ── Unpublished ──────────────────────────────────────────
  if (!form.isPublished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            <CardDescription>This form is currently closed for submissions.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  // ── No fields ────────────────────────────────────────────
  if (sortedFields.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            <CardDescription>This form has no questions yet.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  // ── Thank you ────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-lg">
          <ThankYouScreen
            formTitle={form.title}
            onReset={() => {
              setSubmitted(false);
              setCurrentIndex(0);
              setValues({});
              setErrors({});
            }}
          />
        </div>
      </main>
    );
  }

  // ── Main form ────────────────────────────────────────────
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{form.title}</h1>
          {form.description && <p className="text-sm text-muted-foreground">{form.description}</p>}
        </div>

        {/* Progress */}
        <FormProgress current={currentIndex + 1} total={sortedFields.length} />

        {/* Question card */}
        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
          <AnimatePresence mode="wait" custom={direction}>
            {currentField && (
              <motion.div
                key={currentField.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="p-6 space-y-4"
              >
                {/* Question number + label */}
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Question {currentIndex + 1}
                  </p>
                  <Label htmlFor={currentField.id} className="text-base font-medium leading-snug">
                    {currentField.label}
                    {isRequired && <span className="ml-1 text-destructive">*</span>}
                  </Label>
                  {currentField.description && (
                    <p className="text-sm text-muted-foreground">{currentField.description}</p>
                  )}
                </div>

                {/* Input */}
                <FieldRenderer
                  field={currentField}
                  value={values[currentField.id] ?? ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={errors[currentField.id]}
                />

                {/* Inline error */}
                {errors[currentField.id] && (
                  <p className="text-xs text-destructive">{errors[currentField.id]}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  {/* Skip — only for non-required */}
                  <div>
                    {!isRequired && (
                      <button
                        type="button"
                        onClick={handleSkip}
                        disabled={isSubmitting}
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
                      >
                        Skip
                      </button>
                    )}
                  </div>

                  {isLastField ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting…" : "Submit"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  ) : (
                    <Button onClick={goNext} disabled={isSubmitting}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard hint + nav arrows */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="rounded border px-1 font-mono text-xs">Enter ↵</kbd> to continue
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0 || isSubmitting}
              className="rounded-md border p-1.5 text-muted-foreground transition hover:bg-muted disabled:opacity-30"
              aria-label="Previous question"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={isLastField ? handleSubmit : goNext}
              disabled={isSubmitting}
              className="rounded-md border p-1.5 text-muted-foreground transition hover:bg-muted disabled:opacity-30"
              aria-label="Next question"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
