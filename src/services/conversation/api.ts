import { isAxiosError } from "axios";

import { axiosInstance } from "../axios-instance";

import { CONVERSATION_API_ENDPOINTS } from "./api-endpoints";

import { CreateConversationPayload } from "./types";

export async function createNewConversation(
  payload: CreateConversationPayload
): Promise<void> {
  try {
    await axiosInstance.post(
      CONVERSATION_API_ENDPOINTS.NEW_CONVERSATION,
      payload
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error occurred:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create a new conversation"
      );
    } else {
      console.error("Unexpected error occurred:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
