import { create } from "zustand";

import { ConversationType } from "./common-types";

type ConversationState = {
  currentConversation?: ConversationType;
  setConversationData: (data: ConversationType) => void;
};

export const useConversationStore = create<ConversationState>((set) => ({
  currentConversation: undefined,
  setConversationData: (data) => set(() => ({ currentConversation: data })),
}));
