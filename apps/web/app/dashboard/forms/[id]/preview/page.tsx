"use client";
import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { FormProgress } from "~/components/form/form-progressbar";
import { FieldRenderer } from "~/components/form/form-renderer";
import { ThankYouScreen } from "~/components/form/thank-u-screen";
import { sortFieldsByIndex, validateField } from "~/lib/form-utils";
import { useFormWithFields } from "~/hooks/api/forms";
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

export default function PreviewPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;

  const { form, fields, error, isLoading } = useFormWithFields(formId);

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

    const errorMessage = validateField(currentField, values[currentField.id] ?? "");
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [currentField.id]: errorMessage }));
      return;
    }

    setDirection(1);
    setCurrentIndex((index) => Math.min(index + 1, sortedFields.length - 1));
  }, [currentField, values, sortedFields.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const handleSkip = useCallback(() => {
    if (!currentField || isRequired) return;

    setValues((prev) => ({ ...prev, [currentField.id]: "" }));
    setDirection(1);
    setCurrentIndex((index) => Math.min(index + 1, sortedFields.length - 1));
  }, [currentField, isRequired, sortedFields.length]);

  const handlePreviewSubmit = useCallback(() => {
    if (!currentField) return;

    const errorMessage = validateField(currentField, values[currentField.id] ?? "");
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [currentField.id]: errorMessage }));
      return;
    }

    setSubmitted(true);
  }, [currentField, values]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        isLastField ? handlePreviewSubmit() : goNext();
      }
    },
    [isLastField, handlePreviewSubmit, goNext],
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-5 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading preview…</p>
        </div>
      </main>
    );
  }

  if (error || !form) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md text-center shadow-sm">
          <CardHeader>
            <CardTitle>Preview unavailable</CardTitle>
            <CardDescription>
              {error?.message ?? "This form could not be loaded for preview."}
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-6" onKeyDown={handleKeyDown}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
              <Link href={`/dashboard/forms/${formId}`}>
                <ArrowLeft />
                <span className="sr-only">Back to form builder</span>
              </Link>
            </Button>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Eye className="size-3.5" />
                  Preview mode
                </Badge>
                <Badge variant={form.isPublished ? "default" : "outline"}>
                  {form.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">{form.title}</h1>
                <p className="text-sm text-muted-foreground">
                  This is how respondents will see the form.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/form/${formId}`} target="_blank">
                Open public form
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section
            className="flex min-h-[calc(100vh-10rem)] items-center justify-center rounded-3xl border bg-card p-4 shadow-sm"
            aria-label="Form preview canvas"
          >
            <div className="w-full max-w-lg space-y-6" onKeyDown={handleKeyDown}>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Respondent view
                </p>
                {form.description && (
                  <p className="text-sm text-muted-foreground">{form.description}</p>
                )}
              </div>

              <FormProgress current={currentIndex + 1} total={sortedFields.length} />

              <div className="relative overflow-hidden rounded-2xl border bg-background shadow-sm">
                <AnimatePresence mode="wait" custom={direction}>
                  {sortedFields.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="p-6"
                    >
                      <Card className="border-dashed shadow-none">
                        <CardHeader>
                          <CardTitle>{form.title}</CardTitle>
                          <CardDescription>This form has no questions yet.</CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ) : submitted ? (
                    <motion.div
                      key="thank-you"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="p-6"
                    >
                      <ThankYouScreen
                        formTitle={form.title}
                        onReset={() => {
                          setSubmitted(false);
                          setCurrentIndex(0);
                          setValues({});
                          setErrors({});
                        }}
                      />
                    </motion.div>
                  ) : (
                    currentField && (
                      <motion.div
                        key={currentField.id}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-5 p-6"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Question {currentIndex + 1}
                          </p>
                          <Label
                            htmlFor={currentField.id}
                            className="text-base font-medium leading-snug"
                          >
                            {currentField.label}
                            {isRequired && <span className="ml-1 text-destructive">*</span>}
                          </Label>
                          {currentField.description && (
                            <p className="text-sm text-muted-foreground">
                              {currentField.description}
                            </p>
                          )}
                        </div>

                        <FieldRenderer
                          field={currentField}
                          value={values[currentField.id] ?? ""}
                          onChange={handleChange}
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
                                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                              >
                                Skip
                              </button>
                            )}
                          </div>

                          {isLastField ? (
                            <Button onClick={handlePreviewSubmit}>
                              Submit preview
                              <ArrowRight className="ml-2 size-4" />
                            </Button>
                          ) : (
                            <Button onClick={goNext}>
                              Next
                              <ArrowRight className="ml-2 size-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                <p>
                  Press <kbd className="rounded border px-1 font-mono text-xs">Enter</kbd> to move
                  forward.
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="rounded-md border p-1.5 transition hover:bg-muted disabled:opacity-30"
                    aria-label="Previous question"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={isLastField ? handlePreviewSubmit : goNext}
                    className="rounded-md border p-1.5 transition hover:bg-muted disabled:opacity-30"
                    aria-label="Next question"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border bg-card p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Preview details
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Canvas state</h2>
              </div>
              <Separator />
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Form status</span>
                  <Badge variant={form.isPublished ? "default" : "outline"}>
                    {form.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Questions</span>
                  <span>{sortedFields.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Current step</span>
                  <span>
                    {sortedFields.length === 0 ? 0 : currentIndex + 1} / {sortedFields.length}
                  </span>
                </div>
              </div>
              <Separator />
              <p className="text-sm leading-6 text-muted-foreground">
                This preview uses the same field renderer and progress flow as the public form, so
                the spacing, controls, and transitions match what respondents will see.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
