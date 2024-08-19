export type ConversationType = {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  participants: string[];
  pdfFileURL: string;
  isPublic: boolean;
  isArchived: boolean;
  createdAt: Date;
};
