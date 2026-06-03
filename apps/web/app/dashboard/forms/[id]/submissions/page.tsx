"use client";
/* Enhanced: quiet editorial analytics and response table view. */

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BarChart3, FileText } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useFormResponses } from "~/hooks/api/form-response";

const formatDateTime = (date?: Date | string | null) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function FormSubmissionsPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const { form, fields, responses, error, isLoading } = useFormResponses(formId);

  return (
    <div className="flex flex-1 flex-col bg-[var(--bg)]">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" asChild className="mt-0.5">
                  <Link href="/dashboard/forms">
                    <ArrowLeft />
                    <span className="sr-only">Back to forms</span>
                  </Link>
                </Button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-[2.5rem] font-normal italic leading-none tracking-normal">
                      {form?.title ?? "Submissions"}
                    </h2>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {responses.length} responses
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Review submitted answers for this form.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-mono">
                  Export
                </Button>
                <Button variant="outline" size="sm" asChild className="font-mono">
                  <Link href={`/dashboard/forms/${formId}`}>
                    <FileText />
                    Builder
                  </Link>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <Card className="border-[var(--border)] bg-[var(--surface)]">
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="grid gap-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </CardContent>
              </Card>
            ) : error ? (
              <Empty className="min-h-[360px] border border-[var(--border)] bg-[var(--surface)]">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BarChart3 />
                  </EmptyMedia>
                  <EmptyTitle>Submissions could not be loaded</EmptyTitle>
                  <EmptyDescription>{error.message}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : responses.length === 0 ? (
              <Empty className="min-h-[360px] border border-[var(--border)] bg-[var(--surface)]">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BarChart3 />
                  </EmptyMedia>
                  <EmptyTitle>No submissions yet</EmptyTitle>
                  <EmptyDescription>
                    Responses will appear here after people submit this form.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                      Responses
                    </p>
                    <p className="mt-3 font-mono text-4xl text-[var(--accent)]">
                      {responses.length}
                    </p>
                  </Card>
                  <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                      Fields
                    </p>
                    <p className="mt-3 font-mono text-4xl text-[var(--accent)]">{fields.length}</p>
                  </Card>
                  <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                      Latest
                    </p>
                    <p className="mt-3 font-mono text-sm text-[var(--accent)]">
                      {formatDateTime(responses[0]?.createdAt)}
                    </p>
                  </Card>
                </div>
                <Card className="border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="border-b border-[var(--border)] px-5 pb-5">
                    <CardTitle className="font-serif text-3xl font-normal italic tracking-normal">
                      Responses
                    </CardTitle>
                    <CardDescription className="text-[var(--text-secondary)]">
                      {fields.length} fields across {responses.length} submissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[var(--border)] hover:bg-transparent">
                          <TableHead className="min-w-44 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                            Submitted
                          </TableHead>
                          {fields.map((field) => (
                            <TableHead
                              key={field.id}
                              className="min-w-48 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]"
                            >
                              {field.label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responses.map((response) => (
                          <TableRow
                            key={response.id}
                            className="border-[var(--border)] hover:bg-[var(--surface-2)]"
                          >
                            <TableCell className="font-mono text-xs text-[var(--text-secondary)]">
                              {formatDateTime(response.createdAt)}
                            </TableCell>
                            {fields.map((field) => {
                              const answer = response.answers.find(
                                (item) => item.formFieldId === field.id,
                              );

                              return (
                                <TableCell key={field.id} className="max-w-72 truncate text-sm">
                                  {answer?.value || (
                                    <span className="text-[var(--text-muted)]">No answer</span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
