import { isAxiosError } from "axios";

import { axiosInstance } from "../axios-instance";

import { CONVERSATION_API_ENDPOINTS } from "./api-endpoints";

import { CreateConversationPayload } from "./types";

export async function getConversation(id: string) {
  try {
    return await axiosInstance.get(
      CONVERSATION_API_ENDPOINTS.CONVERSATION + "/" + id
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error occurred:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to get the conversation"
      );
    } else {
      console.error("Unexpected error occurred:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function createNewConversation(
  payload: CreateConversationPayload
) {
  try {
    return await axiosInstance.post(
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

export async function removeConversation(
  conversationId: string,
  userId: string
) {
  try {
    return await axiosInstance.patch(
      CONVERSATION_API_ENDPOINTS.REMOVE_USER_FROM_CONVERSATION +
        "?conversationId=" +
        conversationId +
        "&userId=" +
        userId
    );
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error occurred:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete the conversation"
      );
    } else {
      console.error("Unexpected error occurred:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
