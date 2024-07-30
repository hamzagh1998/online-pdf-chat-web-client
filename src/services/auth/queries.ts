import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { getUserData, signupUser } from "./api";

import { Signup, User } from "./types";

export function useSignupUser(): UseMutationResult<
  void,
  Error,
  Signup,
  unknown
> {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (payload: Signup) => signupUser(payload),
  });
}

export function useUserData(
  isAuthenticated: boolean
): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    enabled: isAuthenticated, // Enable the query only if authenticated
  });
}
