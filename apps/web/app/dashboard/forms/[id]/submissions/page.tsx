"use client";

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
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-4 px-4 lg:px-6">
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
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {form?.title ?? "Submissions"}
                    </h2>
                    <Badge variant="outline">{responses.length} responses</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review submitted answers for this form.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/forms/${formId}`}>
                  <FileText />
                  Builder
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <Card>
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
              <Empty className="min-h-[360px] border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BarChart3 />
                  </EmptyMedia>
                  <EmptyTitle>Submissions could not be loaded</EmptyTitle>
                  <EmptyDescription>{error.message}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : responses.length === 0 ? (
              <Empty className="min-h-[360px] border">
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
              <Card>
                <CardHeader>
                  <CardTitle>Responses</CardTitle>
                  <CardDescription>
                    {fields.length} fields across {responses.length} submissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-44">Submitted</TableHead>
                        {fields.map((field) => (
                          <TableHead key={field.id} className="min-w-48">
                            {field.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.map((response) => (
                        <TableRow key={response.id}>
                          <TableCell className="font-medium">
                            {formatDateTime(response.createdAt)}
                          </TableCell>
                          {fields.map((field) => {
                            const answer = response.answers.find(
                              (item) => item.formFieldId === field.id,
                            );

                            return (
                              <TableCell key={field.id} className="max-w-72 truncate">
                                {answer?.value || (
                                  <span className="text-muted-foreground">No answer</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
