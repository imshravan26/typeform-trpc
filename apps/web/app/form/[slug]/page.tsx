"use client";
/* Enhanced: quiet editorial one-question respondent view. */
import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormProgress } from "~/components/form/form-progressbar";
import { FieldRenderer } from "~/components/form/form-renderer";
import { ThankYouScreen } from "~/components/form/thank-u-screen";
import { sortFieldsByIndex, validateField } from "~/lib/form-utils";
import { useCreateFormSubmission, useFormWithSlug } from "~/hooks/api/forms";
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
  const params = useParams<{ slug: string }>();
  const formSlug = params.slug;

  const { form, fields, error, isLoading } = useFormWithSlug(formSlug);
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
        formId: form!.id,
        values: sortedFields.map((field) => ({
          formFieldId: field.id,
          value: values[field.id] ?? "",
        })),
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  }, [currentField, values, createFormSubmissionAsync, form, sortedFields]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (isLastField) {
          handleSubmit();
        } else {
          goNext();
        }
      }
    },
    [isLastField, handleSubmit, goNext],
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-sm border border-[var(--border)] border-t-[var(--accent)]" />
          <p className="font-mono text-xs text-[var(--text-muted)]">Loading form...</p>
        </div>
      </main>
    );
  }

  if (error || !form) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6 text-foreground">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="font-serif text-4xl font-normal italic tracking-normal">
              Form not found.
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              {error?.message ?? "This form doesn't exist or has been removed."}
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (!form.isPublished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6 text-foreground">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="font-serif text-4xl font-normal italic tracking-normal">
              {form.title}
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              This form is currently closed for submissions.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (sortedFields.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6 text-foreground">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="font-serif text-4xl font-normal italic tracking-normal">
              {form.title}
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              This form has no questions yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-6 text-foreground">
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

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] p-6 text-foreground"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute left-0 right-0 top-0">
        <FormProgress current={currentIndex + 1} total={sortedFields.length} />
      </div>
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            {form.title}
          </p>
          {form.description && (
            <p className="text-sm text-[var(--text-secondary)]">{form.description}</p>
          )}
        </div>

        <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
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
                className="space-y-6 p-6 md:p-8"
              >
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    Question {currentIndex + 1}
                  </p>
                  <Label
                    htmlFor={currentField.id}
                    className="font-serif text-[2rem] font-normal italic leading-tight tracking-normal"
                  >
                    {currentField.label}
                    {isRequired && <span className="ml-1 text-destructive">*</span>}
                  </Label>
                  {currentField.description && (
                    <p className="text-sm text-[var(--text-secondary)]">
                      {currentField.description}
                    </p>
                  )}
                </div>

                <FieldRenderer
                  field={currentField}
                  value={values[currentField.id] ?? ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={errors[currentField.id]}
                />

                {errors[currentField.id] && (
                  <p className="text-xs text-destructive">{errors[currentField.id]}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div>
                    {!isRequired && (
                      <button
                        type="button"
                        onClick={handleSkip}
                        disabled={isSubmitting}
                        className="font-mono text-xs text-[var(--text-muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline disabled:opacity-50"
                      >
                        Skip
                      </button>
                    )}
                  </div>

                  {isLastField ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="font-mono">
                      {isSubmitting ? "Submitting..." : "Submit"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  ) : (
                    <Button onClick={goNext} disabled={isSubmitting} className="font-mono">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            press{" "}
            <kbd className="border border-[var(--border)] px-1 font-mono text-xs">Enter ↵</kbd>
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0 || isSubmitting}
              className="border border-[var(--border)] p-1.5 text-[var(--text-muted)] transition-colors duration-100 hover:bg-[var(--surface-2)] disabled:opacity-30"
              aria-label="Previous question"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={isLastField ? handleSubmit : goNext}
              disabled={isSubmitting}
              className="border border-[var(--border)] p-1.5 text-[var(--text-muted)] transition-colors duration-100 hover:bg-[var(--surface-2)] disabled:opacity-30"
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
