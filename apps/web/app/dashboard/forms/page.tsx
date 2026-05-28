"use client";
import { type FormEvent, useEffect, useState } from "react";
import { BarChart3, Eye, FileText, MoreVertical, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { useCreateForm, useForms } from "~/hooks/api/forms";

const formatDate = (date?: Date | string | null) => {
 

  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export default function FormsPage() {
  const { createFormAsync, isPending } = useCreateForm();
  const { forms, error, isLoading } = useForms();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const resetCreateForm = () => {
    setTitle("");
    setDescription("");
  };

  const handleCreateForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      toast.error("Add a form title");
      return;
    }

    try {
      await createFormAsync({
        title: trimmedTitle,
        description: trimmedDescription || null,
      });

      toast.success("Form created");
      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch {
      toast.error("Failed to create form");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between gap-3 px-4 lg:px-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Forms</h2>
              <p className="text-sm text-muted-foreground">
                Create, edit, and review your form responses.
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) resetCreateForm();
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus />
                  New Form
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateForm} className="grid gap-4">
                  <DialogHeader>
                    <DialogTitle>Create form</DialogTitle>
                    <DialogDescription>Start with the core details.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-2">
                    <Label htmlFor="form-title">Title</Label>
                    <Input
                      id="form-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      maxLength={55}
                      placeholder="Customer feedback"
                      autoFocus
                      disabled={isPending}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Creating..." : "Create Form"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="px-4 lg:px-6">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid flex-1 gap-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="size-8 rounded-md" />
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Empty className="min-h-[360px] border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>Forms could not be loaded</EmptyTitle>
                  <EmptyDescription>{error.message}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : forms.length === 0 ? (
              <Empty className="min-h-[360px] border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>No forms yet</EmptyTitle>
                  <EmptyDescription>Create a form to start collecting responses.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus />
                    New Form
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {forms.map((form) => (
                  <Card key={form.id} className="gap-4">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <FileText className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-base">{form.title}</CardTitle>
                          <CardDescription className="mt-1 line-clamp-2 min-h-10">
                            {form.description || "No description"}
                          </CardDescription>
                        </div>
                        <CardAction>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreVertical />
                                <span className="sr-only">Open form actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/forms/${form.id}`}>
                                  <Eye />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/forms/${form.id}`}>
                                  <Pencil />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/forms/${form.id}/submissions`}>
                                  <BarChart3 />
                                  Submissions
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Copy link</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardAction>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant={form.isPublished ? "default" : "outline"}>
                          {form.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created {formatDate(form.createdAt)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/dashboard/forms/${form.id}/submissions`}>
                            <BarChart3 />
                            Submissions
                          </Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href={`/dashboard/forms/${form.id}`}>
                            <Pencil />
                            Builder
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
