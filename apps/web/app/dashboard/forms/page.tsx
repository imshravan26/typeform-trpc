"use client";
/* Enhanced: quiet editorial forms grid with amber actions and refined empty states. */
import { type FormEvent, useState } from "react";
import { BarChart3, Copy, Eye, FileText, MoreVertical, Pencil, Plus } from "lucide-react";
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

  const getReceiverLink = (slug: string) => `${window.location.origin}/form/${slug}`;

  const handleCopyReceiverLink = async (slug?: string | null) => {
    if (!slug) {
      toast.error("Receiver link is not available for this form");
      return;
    }

    try {
      await navigator.clipboard.writeText(getReceiverLink(slug));
      toast.success("Receiver link copied");
    } catch {
      toast.error("Failed to copy receiver link");
    }
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
    <div className="flex flex-1 flex-col bg-[var(--bg)]">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-[2.5rem] font-normal italic leading-none tracking-normal">
                Your forms
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
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
                <Button size="sm" className="font-mono">
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

                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="form-title"
                      className="font-mono text-xs text-[var(--text-muted)]"
                    >
                      Title
                    </Label>
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
                      className="font-mono"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending} className="font-mono">
                      {isPending ? "Creating..." : "Create Form"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="border-[var(--border)] bg-[var(--surface)] p-5">
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
              <Empty className="min-h-[360px] border border-[var(--border)] bg-[var(--surface)]">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>Forms could not be loaded</EmptyTitle>
                  <EmptyDescription>{error.message}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : forms.length === 0 ? (
              <Empty className="min-h-[360px] border border-[var(--border)] bg-[var(--surface)]">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle className="font-serif text-5xl font-normal italic tracking-normal">
                    No forms yet.
                  </EmptyTitle>
                  <EmptyDescription className="text-[var(--text-secondary)]">
                    Create a form to start collecting responses.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="font-mono">
                    <Plus />
                    New Form
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {forms.map((form) => (
                  <Card
                    key={form.id}
                    className="gap-4 border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]"
                  >
                    <CardHeader className="px-0">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)]">
                          <FileText className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-base font-medium">
                            {form.title}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-2 min-h-10 text-[var(--text-secondary)]">
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
                              <DropdownMenuItem
                                onSelect={() => void handleCopyReceiverLink(form.slug)}
                              >
                                <Copy />
                                Copy receiver link
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardAction>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 px-0">
                      <div className="flex items-center justify-between gap-3">
                        <Badge
                          variant={form.isPublished ? "default" : "outline"}
                          className="font-mono text-[10px]"
                        >
                          {form.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          Updated {formatDate(form.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                          0 responses
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          Created {formatDate(form.createdAt)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button asChild variant="outline" className="w-full font-mono">
                          <Link href={`/dashboard/forms/${form.id}/submissions`}>
                            <BarChart3 />
                            Submissions
                          </Link>
                        </Button>
                        <Button asChild className="w-full font-mono">
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
