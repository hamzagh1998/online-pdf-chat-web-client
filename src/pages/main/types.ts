export type MessageType = {
  _id: string;
  conversationId: string;
  isAiResponse: boolean;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    photoURL: string;
  };
  timestamp: string;
};
