import { trpc } from "~/trpc/client";

type UseFormResponseOptions = {
  enabled?: boolean;
};

export const useFormResponses = (formId: string, options?: UseFormResponseOptions) => {
  const { data, error, isFetched, isLoading, isPending } =
    trpc.formResponse.listFormResponses.useQuery(
      { formId },
      {
        enabled: options?.enabled ?? Boolean(formId),
      },
    );

  return {
    form: data?.form,
    fields: data?.fields ?? [],
    responses: data?.responses ?? [],
    error,
    isFetched,
    isLoading,
    isPending,
  };
};

export const useFormResponseAnalytics = (formId: string, options?: UseFormResponseOptions) => {
  const { data, error, isFetched, isLoading, isPending } =
    trpc.formResponse.getFormResponseAnalytics.useQuery(
      { formId },
      {
        enabled: options?.enabled ?? Boolean(formId),
      },
    );

  return {
    analytics: data,
    error,
    isFetched,
    isLoading,
    isPending,
  };
};
