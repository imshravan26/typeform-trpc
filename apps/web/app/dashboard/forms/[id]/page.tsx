import Link from "next/link";
import { ArrowLeft, Eye, FileText, GripVertical, Plus, Settings } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

export default function FormBuilderPage({ params }: { params: { id: string } }) {
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
                    <h2 className="text-2xl font-semibold tracking-tight">Form Builder</h2>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Configure form {params.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye />
                  Preview
                </Button>
                <Button size="sm">Publish</Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>These details appear at the top of the form.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="builder-title">Title</Label>
                      <Input id="builder-title" placeholder="Customer feedback" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="builder-description">Description</Label>
                      <Textarea
                        id="builder-description"
                        placeholder="Collect feedback after a support interaction."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle>Fields</CardTitle>
                        <CardDescription>Add and arrange the questions in this form.</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus />
                        Add Field
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <GripVertical className="size-4 text-muted-foreground" />
                      <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">Untitled question</p>
                        <p className="text-sm text-muted-foreground">Text field</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings />
                        <span className="sr-only">Field settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Setup</CardTitle>
                  <CardDescription>Review the form state before publishing.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Responses</span>
                    <span>0</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Fields</span>
                    <span>1</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
