"use client";

import { CalendarDays, FileText, Mail, ShieldCheck, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useUser } from "~/hooks/api/auth";
import { useForms } from "~/hooks/api/forms";

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.trim() || "User";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};

const formatDate = (date?: Date | string | null) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export default function UserPage() {
  const { user, error: userError, isLoading: isUserLoading } = useUser();
  const { forms, error: formsError, isLoading: areFormsLoading } = useForms();

  const publishedForms = forms.filter((form) => form.isPublished).length;
  const draftForms = forms.length - publishedForms;
  const latestForm = forms
    .filter((form) => form.createdAt)
    .sort((first, second) => {
      const firstTime = new Date(first.createdAt ?? 0).getTime();
      const secondTime = new Date(second.createdAt ?? 0).getTime();
      return secondTime - firstTime;
    })[0];

  if (isUserLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>Account unavailable</CardTitle>
                <CardDescription>
                  {userError?.message ?? "Your account details could not be loaded."}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">User profile</h2>
            <p className="text-sm text-muted-foreground">Account details and workspace activity.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-20 rounded-xl">
                    <AvatarImage src={user.avatarURL ?? undefined} alt={user.fullName} />
                    <AvatarFallback className="rounded-xl text-lg">
                      {getInitials(user.fullName, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="truncate text-xl">{user.fullName}</CardTitle>
                      <Badge variant="secondary" className="gap-1.5">
                        <ShieldCheck className="size-3.5" />
                        Active
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Mail className="size-4" />
                      <span className="truncate">{user.email}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-5">
                <Separator />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserCircle className="size-4" />
                      User ID
                    </div>
                    <p className="mt-2 break-all font-mono text-sm">{user.id}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4" />
                      Latest form
                    </div>
                    <p className="mt-2 text-sm font-medium">{formatDate(latestForm?.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Workspace</CardTitle>
                <CardDescription>Your current form activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {areFormsLoading ? (
                  <>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </>
                ) : formsError ? (
                  <p className="text-sm text-muted-foreground">{formsError.message}</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="size-4" />
                        Total forms
                      </span>
                      <span className="text-lg font-semibold">{forms.length}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Published</span>
                      <Badge>{publishedForms}</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Drafts</span>
                      <Badge variant="outline">{draftForms}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
