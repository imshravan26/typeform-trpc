"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, FileText, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  useCreateField,
  useDeleteField,
  useFormFields,
  useUpdateField,
} from "~/hooks/api/forms";

type FieldType = "TEXT" | "EMAIL" | "NUMBER" | "YES_NO" | "PASSWORD";

type CreatedField = {
  id: string;
  label: string;
  description: string | null;
  placeholder: string | null;
  type: FieldType;
  isRequired: boolean;
  index: string;
};

const fieldTypeLabels: Record<FieldType, string> = {
  TEXT: "Text field",
  EMAIL: "Email field",
  NUMBER: "Number field",
  YES_NO: "Yes / No field",
  PASSWORD: "Password field",
};

export default function FormBuilderPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const { fields: formFields, error: fieldsError, isLoading: areFieldsLoading } = useFormFields(formId);
  const { createFieldAsync, isPending: isCreatingField } = useCreateField();
  const { updateFieldAsync, isPending: isUpdatingField } = useUpdateField();
  const { deleteFieldAsync, isPending: isDeletingField } = useDeleteField();
  const [isCreateFieldDialogOpen, setIsCreateFieldDialogOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [createdFields, setCreatedFields] = useState<CreatedField[]>([]);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldPlaceholder, setFieldPlaceholder] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("TEXT");
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    setCreatedFields(
      formFields.map((field) => ({
        id: field.id,
        label: field.label,
        description: field.description ?? null,
        placeholder: field.placeholder ?? null,
        type: field.type,
        isRequired: Boolean(field.isRequired),
        index: field.index,
      })),
    );
  }, [formFields]);

  const resetCreateField = () => {
    setFieldLabel("");
    setFieldDescription("");
    setFieldPlaceholder("");
    setFieldType("TEXT");
    setIsRequired(false);
  };

  const openEditFieldDialog = (field: CreatedField) => {
    setEditingFieldId(field.id);
    setFieldLabel(field.label);
    setFieldDescription(field.description ?? "");
    setFieldPlaceholder(field.placeholder ?? "");
    setFieldType(field.type);
    setIsRequired(field.isRequired);
  };

  const closeEditFieldDialog = () => {
    setEditingFieldId(null);
    resetCreateField();
  };

  const handleCreateField = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedLabel = fieldLabel.trim();
    const trimmedDescription = fieldDescription.trim();
    const trimmedPlaceholder = fieldPlaceholder.trim();

    if (!trimmedLabel) {
      toast.error("Add a field label");
      return;
    }

    try {
      const { id } = await createFieldAsync({
        label: trimmedLabel,
        description: trimmedDescription || null,
        placeholder: trimmedPlaceholder || null,
        isRequired,
        index: (createdFields.length + 1).toString(),
        type: fieldType,
        formId,
      });

      setCreatedFields((fields) => [
        ...fields,
        {
          id,
          label: trimmedLabel,
          description: trimmedDescription || null,
          placeholder: trimmedPlaceholder || null,
          type: fieldType,
          isRequired,
          index: (createdFields.length + 1).toString(),
        },
      ]);
      toast.success("Field created");
      resetCreateField();
      setIsCreateFieldDialogOpen(false);
    } catch {
      toast.error("Failed to create field");
    }
  };

  const handleUpdateField = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingFieldId) return;

    const trimmedLabel = fieldLabel.trim();
    const trimmedDescription = fieldDescription.trim();
    const trimmedPlaceholder = fieldPlaceholder.trim();

    if (!trimmedLabel) {
      toast.error("Add a field label");
      return;
    }

    try {
      await updateFieldAsync({
        id: editingFieldId,
        label: trimmedLabel,
        description: trimmedDescription || null,
        placeholder: trimmedPlaceholder || null,
        isRequired,
        type: fieldType,
      });

      setCreatedFields((fields) =>
        fields.map((field) =>
          field.id === editingFieldId
            ? {
                ...field,
                label: trimmedLabel,
                description: trimmedDescription || null,
                placeholder: trimmedPlaceholder || null,
                type: fieldType,
                isRequired,
              }
            : field,
        ),
      );
      toast.success("Field updated");
      closeEditFieldDialog();
    } catch {
      toast.error("Failed to update field");
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await deleteFieldAsync({ id: fieldId });
      setCreatedFields((fields) => fields.filter((field) => field.id !== fieldId));
      toast.success("Field deleted");
    } catch {
      toast.error("Failed to delete field");
    }
  };

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
                  <p className="text-sm text-muted-foreground">Configure form {formId}</p>
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
                      <Dialog
                        open={isCreateFieldDialogOpen}
                        onOpenChange={(open) => {
                          setIsCreateFieldDialogOpen(open);
                          if (!open) resetCreateField();
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus />
                            Add Field
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <form onSubmit={handleCreateField} className="grid gap-4">
                            <DialogHeader>
                              <DialogTitle>Create field</DialogTitle>
                              <DialogDescription>Add a new question to this form.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-2">
                              <Label htmlFor="field-label">Label</Label>
                              <Input
                                id="field-label"
                                value={fieldLabel}
                                onChange={(event) => setFieldLabel(event.target.value)}
                                maxLength={255}
                                placeholder="What is your email?"
                                autoFocus
                                disabled={isCreatingField}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="field-type">Type</Label>
                              <Select
                                value={fieldType}
                                onValueChange={(value) => setFieldType(value as FieldType)}
                                disabled={isCreatingField}
                              >
                                <SelectTrigger id="field-type" className="w-full">
                                  <SelectValue placeholder="Select a field type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TEXT">Text</SelectItem>
                                  <SelectItem value="EMAIL">Email</SelectItem>
                                  <SelectItem value="NUMBER">Number</SelectItem>
                                  <SelectItem value="YES_NO">Yes / No</SelectItem>
                                  <SelectItem value="PASSWORD">Password</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="field-placeholder">Placeholder</Label>
                              <Input
                                id="field-placeholder"
                                value={fieldPlaceholder}
                                onChange={(event) => setFieldPlaceholder(event.target.value)}
                                placeholder="name@example.com"
                                disabled={isCreatingField}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="field-description">Description</Label>
                              <Textarea
                                id="field-description"
                                value={fieldDescription}
                                onChange={(event) => setFieldDescription(event.target.value)}
                                placeholder="Shown below the question."
                                disabled={isCreatingField}
                              />
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                              <div className="grid gap-1">
                                <Label htmlFor="field-required">Required</Label>
                                <p className="text-sm text-muted-foreground">
                                  Respondents must answer this question.
                                </p>
                              </div>
                              <Switch
                                id="field-required"
                                checked={isRequired}
                                onCheckedChange={setIsRequired}
                                disabled={isCreatingField}
                              />
                            </div>

                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateFieldDialogOpen(false)}
                                disabled={isCreatingField}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isCreatingField}>
                                {isCreatingField ? "Creating..." : "Create Field"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {areFieldsLoading ? (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        Loading fields...
                      </div>
                    ) : fieldsError ? (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        {fieldsError.message}
                      </div>
                    ) : createdFields.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No fields added yet.
                      </div>
                    ) : (
                      createdFields.map((field) => (
                        <div key={field.id} className="flex items-center gap-3 rounded-lg border p-3">
                          <GripVertical className="size-4 text-muted-foreground" />
                          <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">{field.label}</p>
                              {field.isRequired ? <Badge variant="outline">Required</Badge> : null}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {fieldTypeLabels[field.type]}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditFieldDialog(field)}
                              disabled={isUpdatingField || isDeletingField}
                            >
                              <Pencil />
                              <span className="sr-only">Edit field</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteField(field.id)}
                              disabled={isUpdatingField || isDeletingField}
                            >
                              <Trash2 />
                              <span className="sr-only">Delete field</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
                    <span>{createdFields.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(editingFieldId)}
        onOpenChange={(open) => {
          if (!open) closeEditFieldDialog();
        }}
      >
        <DialogContent>
          <form onSubmit={handleUpdateField} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Edit field</DialogTitle>
              <DialogDescription>Update this question and its response settings.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-label">Label</Label>
              <Input
                id="edit-field-label"
                value={fieldLabel}
                onChange={(event) => setFieldLabel(event.target.value)}
                maxLength={255}
                placeholder="What is your email?"
                disabled={isUpdatingField}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-type">Type</Label>
              <Select
                value={fieldType}
                onValueChange={(value) => setFieldType(value as FieldType)}
                disabled={isUpdatingField}
              >
                <SelectTrigger id="edit-field-type" className="w-full">
                  <SelectValue placeholder="Select a field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="NUMBER">Number</SelectItem>
                  <SelectItem value="YES_NO">Yes / No</SelectItem>
                  <SelectItem value="PASSWORD">Password</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-placeholder">Placeholder</Label>
              <Input
                id="edit-field-placeholder"
                value={fieldPlaceholder}
                onChange={(event) => setFieldPlaceholder(event.target.value)}
                placeholder="name@example.com"
                disabled={isUpdatingField}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-description">Description</Label>
              <Textarea
                id="edit-field-description"
                value={fieldDescription}
                onChange={(event) => setFieldDescription(event.target.value)}
                placeholder="Shown below the question."
                disabled={isUpdatingField}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="grid gap-1">
                <Label htmlFor="edit-field-required">Required</Label>
                <p className="text-sm text-muted-foreground">
                  Respondents must answer this question.
                </p>
              </div>
              <Switch
                id="edit-field-required"
                checked={isRequired}
                onCheckedChange={setIsRequired}
                disabled={isUpdatingField}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeEditFieldDialog}
                disabled={isUpdatingField}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingField}>
                {isUpdatingField ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
