"use client";
/* Enhanced: quiet editorial two-panel form builder layout. */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, Eye, FileText, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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
  useFormWithFields,
  useReorderFields,
  useUpdateField,
  useUpdateFormPublishStatus,
} from "~/hooks/api/forms";

type FieldType =
  | "TEXT"
  | "LONG_TEXT"
  | "EMAIL"
  | "NUMBER"
  | "YES_NO"
  | "SELECT"
  | "MULTI_SELECT"
  | "RATING"
  | "DATE"
  | "PASSWORD";

type CreatedField = {
  id: string;
  label: string;
  description: string | null;
  placeholder: string | null;
  type: FieldType;
  isRequired: boolean;
  index: string;
};

type FieldFormValues = {
  label: string;
  description: string;
  placeholder: string;
  type: FieldType;
  isRequired: boolean;
};

const fieldTypeLabels: Record<FieldType, string> = {
  TEXT: "Text field",
  EMAIL: "Email field",
  NUMBER: "Number field",
  YES_NO: "Yes / No field",
  PASSWORD: "Password field",
  LONG_TEXT: "Long text field",
  SELECT: "Select field",
  MULTI_SELECT: "Multi-select field",
  RATING: "Rating field",
  DATE: "Date field",
};

const FIELD_INDEX_STEP = 1000;

const getNextFieldIndex = (fields: CreatedField[]) =>
  (
    Math.max(
      0,
      ...fields.map((field) => {
        const index = Number(field.index);
        return Number.isFinite(index) ? index : 0;
      }),
    ) + FIELD_INDEX_STEP
  ).toString();

const getReindexedFields = (fields: CreatedField[]) =>
  fields.map((field, index) => ({
    ...field,
    index: ((index + 1) * FIELD_INDEX_STEP).toString(),
  }));

type SortableFieldItemProps = {
  field: CreatedField;
  isDisabled: boolean;
  onEdit: (field: CreatedField) => void;
  onDelete: (fieldId: string) => void;
};

function SortableFieldItem({ field, isDisabled, onEdit, onDelete }: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    disabled: isDisabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center gap-3 border border-l-2 border-[var(--border)] border-l-transparent bg-[var(--surface)] p-3 transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)] ${
        isDragging ? "border-l-[var(--accent)] bg-[var(--surface-2)]" : ""
      }`}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 cursor-grab text-[var(--text-muted)] active:cursor-grabbing"
        disabled={isDisabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground" />
        <span className="sr-only">Reorder field</span>
      </Button>
      <div className="flex size-9 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--bg)] text-[var(--text-secondary)]">
        <FileText className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{field.label}</p>
          {field.isRequired ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              Required
            </Badge>
          ) : null}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          {fieldTypeLabels[field.type]}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(field)} disabled={isDisabled}>
          <Pencil />
          <span className="sr-only">Edit field</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(field.id)}
          disabled={isDisabled}
        >
          <Trash2 />
          <span className="sr-only">Delete field</span>
        </Button>
      </div>
    </div>
  );
}

export default function FormBuilderPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const {
    fields: formFields,
    error: fieldsError,
    isLoading: areFieldsLoading,
  } = useFormFields(formId);
  const { form } = useFormWithFields(formId);
  const { createFieldAsync, isPending: isCreatingField } = useCreateField();
  const { updateFieldAsync, isPending: isUpdatingField } = useUpdateField();
  const { deleteFieldAsync, isPending: isDeletingField } = useDeleteField();
  const { reorderFieldsAsync, isPending: isReorderingFields } = useReorderFields();
  const { updateFormPublishStatusAsync, isPending: isUpdatingPublishStatus } =
    useUpdateFormPublishStatus();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [isCreateFieldDialogOpen, setIsCreateFieldDialogOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [createdFields, setCreatedFields] = useState<CreatedField[]>([]);
  const fieldForm = useForm<FieldFormValues>({
    defaultValues: {
      label: "",
      description: "",
      placeholder: "",
      type: "TEXT",
      isRequired: false,
    },
  });

  const selectedFieldType = fieldForm.watch("type");
  const selectedIsRequired = fieldForm.watch("isRequired");

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
    fieldForm.reset({
      label: "",
      description: "",
      placeholder: "",
      type: "TEXT",
      isRequired: false,
    });
  };

  const openEditFieldDialog = (field: CreatedField) => {
    setEditingFieldId(field.id);
    fieldForm.reset({
      label: field.label,
      description: field.description ?? "",
      placeholder: field.placeholder ?? "",
      type: field.type,
      isRequired: field.isRequired,
    });
  };

  const closeEditFieldDialog = () => {
    setEditingFieldId(null);
    resetCreateField();
  };

  const handleCreateField: SubmitHandler<FieldFormValues> = async (values) => {
    const trimmedLabel = values.label.trim();
    const trimmedDescription = values.description.trim();
    const trimmedPlaceholder = values.placeholder.trim();

    if (!trimmedLabel) {
      toast.error("Add a field label");
      return;
    }

    try {
      const nextIndex = getNextFieldIndex(createdFields);
      const { id } = await createFieldAsync({
        label: trimmedLabel,
        description: trimmedDescription || null,
        placeholder: trimmedPlaceholder || null,
        isRequired: values.isRequired,
        index: nextIndex,
        type: values.type,
        formId,
      });

      toast.success("Field created");
      resetCreateField();
      setIsCreateFieldDialogOpen(false);
    } catch {
      toast.error("Failed to create field");
    }
  };

  const handleUpdateField: SubmitHandler<FieldFormValues> = async (values) => {
    if (!editingFieldId) return;

    const trimmedLabel = values.label.trim();
    const trimmedDescription = values.description.trim();
    const trimmedPlaceholder = values.placeholder.trim();

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
        isRequired: values.isRequired,
        type: values.type,
      });

      setCreatedFields((fields) =>
        fields.map((field) =>
          field.id === editingFieldId
            ? {
                ...field,
                label: trimmedLabel,
                description: trimmedDescription || null,
                placeholder: trimmedPlaceholder || null,
                type: values.type,
                isRequired: values.isRequired,
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = createdFields.findIndex((field) => field.id === active.id);
    const newIndex = createdFields.findIndex((field) => field.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const previousFields = createdFields;
    const reorderedFields = getReindexedFields(arrayMove(createdFields, oldIndex, newIndex));

    setCreatedFields(reorderedFields);

    try {
      await reorderFieldsAsync({
        formId,
        fields: reorderedFields.map((field) => ({
          id: field.id,
          index: field.index,
        })),
      });
      toast.success("Fields reordered");
    } catch {
      setCreatedFields(previousFields);
      toast.error("Failed to reorder fields");
    }
  };

  const handleTogglePublishStatus = async () => {
    try {
      await updateFormPublishStatusAsync({
        formId,
        isPublished: !form?.isPublished,
      });

      toast.success(form?.isPublished ? "Form unpublished" : "Form published");
    } catch {
      toast.error("Failed to update publish status");
    }
  };

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
                    <h2 className="font-mono text-xl font-medium tracking-normal">
                      {form?.title ?? "Form Builder"}
                    </h2>
                    <Badge
                      variant={form?.isPublished ? "default" : "outline"}
                      className="font-mono text-[10px]"
                    >
                      {form?.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-[var(--text-muted)]">
                    Configure form {formId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="font-mono">
                  <Link href={`/dashboard/forms/${formId}/preview`}>
                    <Eye />
                    Preview
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="font-mono"
                  onClick={handleTogglePublishStatus}
                  disabled={isUpdatingPublishStatus || !form}
                >
                  {isUpdatingPublishStatus
                    ? "Saving..."
                    : form?.isPublished
                      ? "Unpublish"
                      : "Publish"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
              <div className="contents">
                <Card className="xl:col-start-2">
                  <CardHeader className="border-b border-[var(--border)] px-5 pb-5">
                    <div className="flex gap-6 border-b border-[var(--border)] pb-4 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                      <span className="border-b border-[var(--accent)] pb-2 text-foreground">
                        Settings
                      </span>
                      <span className="pb-2">Fields</span>
                      <span className="pb-2">Logic</span>
                    </div>
                    <CardTitle className="font-serif text-3xl font-normal italic tracking-normal">
                      Details
                    </CardTitle>
                    <CardDescription className="text-[var(--text-secondary)]">
                      These details appear at the top of the form.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5 px-5 pt-5">
                    <div className="grid gap-1.5 border-b border-[var(--border)] pb-5">
                      <Label
                        htmlFor="builder-title"
                        className="font-mono text-xs text-[var(--text-muted)]"
                      >
                        Title
                      </Label>
                      <Input id="builder-title" placeholder="Customer feedback" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label
                        htmlFor="builder-description"
                        className="font-mono text-xs text-[var(--text-muted)]"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="builder-description"
                        className="rounded-sm border-[var(--border)] bg-transparent font-mono focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[rgba(245,158,11,0.5)]"
                        placeholder="Collect feedback after a support interaction."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="xl:col-start-1 xl:row-span-2 xl:row-start-1">
                  <CardHeader className="border-b border-[var(--border)] px-5 pb-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="font-serif text-2xl font-normal italic tracking-normal">
                          Fields
                        </CardTitle>
                      </div>
                      <Dialog
                        open={isCreateFieldDialogOpen}
                        onOpenChange={(open) => {
                          setIsCreateFieldDialogOpen(open);
                          if (!open) resetCreateField();
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="font-mono">
                            <Plus />
                            Add Field
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <form
                            onSubmit={fieldForm.handleSubmit(handleCreateField)}
                            className="grid gap-4"
                          >
                            <DialogHeader>
                              <DialogTitle>Create field</DialogTitle>
                              <DialogDescription>
                                Add a new question to this form.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-1.5">
                              <Label
                                htmlFor="field-label"
                                className="font-mono text-xs text-[var(--text-muted)]"
                              >
                                Label
                              </Label>
                              <Input
                                id="field-label"
                                maxLength={255}
                                placeholder="What is your email?"
                                autoFocus
                                disabled={isCreatingField}
                                {...fieldForm.register("label", { required: true })}
                              />
                            </div>

                            <div className="grid gap-1.5">
                              <Label
                                htmlFor="field-type"
                                className="font-mono text-xs text-[var(--text-muted)]"
                              >
                                Type
                              </Label>
                              <Select
                                value={selectedFieldType}
                                onValueChange={(value) =>
                                  fieldForm.setValue("type", value as FieldType)
                                }
                                disabled={isCreatingField}
                              >
                                <SelectTrigger id="field-type" className="w-full">
                                  <SelectValue placeholder="Select a field type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(fieldTypeLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-1.5">
                              <Label
                                htmlFor="field-placeholder"
                                className="font-mono text-xs text-[var(--text-muted)]"
                              >
                                Placeholder
                              </Label>
                              <Input
                                id="field-placeholder"
                                placeholder="name@example.com"
                                disabled={isCreatingField}
                                {...fieldForm.register("placeholder")}
                              />
                            </div>

                            <div className="grid gap-1.5">
                              <Label
                                htmlFor="field-description"
                                className="font-mono text-xs text-[var(--text-muted)]"
                              >
                                Description
                              </Label>
                              <Textarea
                                id="field-description"
                                placeholder="Shown below the question."
                                disabled={isCreatingField}
                                {...fieldForm.register("description")}
                              />
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-sm border border-[var(--border)] p-3">
                              <div className="grid gap-1">
                                <Label htmlFor="field-required">Required</Label>
                                <p className="text-sm text-[var(--text-secondary)]">
                                  Respondents must answer this question.
                                </p>
                              </div>
                              <Switch
                                id="field-required"
                                checked={selectedIsRequired}
                                onCheckedChange={(checked) =>
                                  fieldForm.setValue("isRequired", checked)
                                }
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
                  <CardContent className="grid gap-3 px-5 pt-5">
                    {areFieldsLoading ? (
                      <div className="rounded-sm border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-secondary)]">
                        Loading fields...
                      </div>
                    ) : fieldsError ? (
                      <div className="rounded-sm border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-secondary)]">
                        {fieldsError.message}
                      </div>
                    ) : createdFields.length === 0 ? (
                      <div className="rounded-sm border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-secondary)]">
                        No fields added yet.
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={createdFields.map((field) => field.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="grid gap-2">
                            {createdFields.map((field) => (
                              <SortableFieldItem
                                key={field.id}
                                field={field}
                                isDisabled={
                                  isUpdatingField || isDeletingField || isReorderingFields
                                }
                                onEdit={openEditFieldDialog}
                                onDelete={handleDeleteField}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="h-fit xl:col-start-2">
                <CardHeader className="border-b border-[var(--border)] px-5 pb-5">
                  <CardTitle className="font-serif text-3xl font-normal italic tracking-normal">
                    Setup
                  </CardTitle>
                  <CardDescription className="text-[var(--text-secondary)]">
                    Review the form state before publishing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 px-5 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)]">Status</span>
                    <Badge
                      variant={form?.isPublished ? "default" : "outline"}
                      className="font-mono text-[10px]"
                    >
                      {form?.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)]">Responses</span>
                    <span className="font-mono">0</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)]">Fields</span>
                    <span className="font-mono">{createdFields.length}</span>
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
          <form onSubmit={fieldForm.handleSubmit(handleUpdateField)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Edit field</DialogTitle>
              <DialogDescription>Update this question and its response settings.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-label">Label</Label>
              <Input
                id="edit-field-label"
                maxLength={255}
                placeholder="What is your email?"
                disabled={isUpdatingField}
                {...fieldForm.register("label", { required: true })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-type">Type</Label>
              <Select
                value={selectedFieldType}
                onValueChange={(value) => fieldForm.setValue("type", value as FieldType)}
                disabled={isUpdatingField}
              >
                <SelectTrigger id="edit-field-type" className="w-full">
                  <SelectValue placeholder="Select a field type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fieldTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-placeholder">Placeholder</Label>
              <Input
                id="edit-field-placeholder"
                placeholder="name@example.com"
                disabled={isUpdatingField}
                {...fieldForm.register("placeholder")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-field-description">Description</Label>
              <Textarea
                id="edit-field-description"
                placeholder="Shown below the question."
                disabled={isUpdatingField}
                {...fieldForm.register("description")}
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
                checked={selectedIsRequired}
                onCheckedChange={(checked) => fieldForm.setValue("isRequired", checked)}
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
