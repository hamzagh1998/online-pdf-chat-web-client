import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { getUserData, signupUser } from "./api";

import { UserDataType } from "@/hooks/store/use-user-store";

import { SignupPayload } from "./types";

export function useSignupUser(): UseMutationResult<
  void,
  Error,
  SignupPayload,
  unknown
> {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (payload: SignupPayload) => signupUser(payload),
  });
}

export function useUserData(
  isAuthenticated: boolean
): UseQueryResult<UserDataType, Error> {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    enabled: isAuthenticated, // Enable the query only if authenticated
  });
}
