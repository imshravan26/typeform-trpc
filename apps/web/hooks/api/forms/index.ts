import { trpc } from "~/trpc/client";

type UseFieldOptions = {
  enabled?: boolean;
};

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useCreateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFieldAsync,
    mutate: createField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.createField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFieldAsync,
    createField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useField = (id: string, options?: UseFieldOptions) => {
  const { data, error, isFetched, isLoading, isPending } = trpc.form.getField.useQuery(
    { id },
    {
      enabled: options?.enabled ?? Boolean(id),
    },
  );

  return {
    field: data?.field,
    error,
    isFetched,
    isLoading,
    isPending,
  };
};

export const useFormFields = (formId: string, options?: UseFieldOptions) => {
  const { data, error, isFetched, isLoading, isPending } = trpc.form.listFields.useQuery(
    { formId },
    {
      enabled: options?.enabled ?? Boolean(formId),
    },
  );

  return {
    fields: data?.fields ?? [],
    error,
    isFetched,
    isLoading,
    isPending,
  };
};

export const useFormWithFields = (formId: string, options?: UseFieldOptions) => {
  const { data, error, isFetched, isLoading, isPending } = trpc.form.getFormWithFields.useQuery(
    { formId },
    {
      enabled: options?.enabled ?? Boolean(formId),
    },
  );

  return {
    form: data?.form,
    fields: data?.form.fields ?? [],
    error,
    isFetched,
    isLoading,
    isPending,
  };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFieldAsync,
    mutate: updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.updateField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    updateFieldAsync,
    updateField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useReorderFields = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: reorderFieldsAsync,
    mutate: reorderFields,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.reorderFields.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    reorderFieldsAsync,
    reorderFields,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFieldAsync,
    mutate: deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.deleteField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useUpdateFormPublishStatus = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFormPublishStatusAsync,
    mutate: updateFormPublishStatus,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.updateFormPublishStatus.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    updateFormPublishStatusAsync,
    updateFormPublishStatus,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useCreateFormSubmission = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormSubmissionAsync,
    mutate: createFormSubmission,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.form.createFormSubmission.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormSubmissionAsync,
    createFormSubmission,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useForms = () => {
  const { data, error, isFetched, isLoading, isPending } = trpc.form.listForms.useQuery();

  return {
    forms: data?.forms ?? [],
    error,
    isFetched,
    isLoading,
    isPending,
  };
};
