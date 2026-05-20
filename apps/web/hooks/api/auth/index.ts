import { trpc } from "~/trpc/client";

export const useSignup = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    createUserWithEmailAndPasswordAsync,
    createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useSignIn = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: signInWithEmailAndPasswordAsync,
    mutate: signInWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  } = trpc.auth.signInWithEmailAndPassword.useMutation({
    onSuccess: async () => {
      await utils.auth.getLoggedInUserInfo.invalidate();
    },
  });

  return {
    signInWithEmailAndPasswordAsync,
    signInWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
  };
};

export const useUser = () => {
  const {
    data: user,
    error,
    isFetched,
    isLoading,
    isPending,
  } = trpc.auth.getLoggedInUserInfo.useQuery();

  return {
    user,
    error,
    isFetched,
    isLoading,
    isPending,
  };
};
