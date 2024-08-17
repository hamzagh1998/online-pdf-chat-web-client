import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

import { useUserStore } from "@/hooks/store/use-user-store";

import { createNewConversation } from "./api";

import { CreateConversationPayload } from "./types";

import { getUserData } from "../auth/api";

import { User } from "../auth/types";

export function useCreateConversation(): UseMutationResult<
  void,
  Error,
  CreateConversationPayload,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createConversation"],
    mutationFn: async (payload: CreateConversationPayload) => {
      try {
        await createNewConversation(payload);
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
  });
}
