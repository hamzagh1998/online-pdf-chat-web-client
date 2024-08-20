export type MessageType = {
  _id: string;
  conversationId: string;
  isAIResponse: boolean;
  content: string;
  senderId: string;
  timestamp: Date;
};
