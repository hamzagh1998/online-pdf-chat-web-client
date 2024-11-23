export type ConversationType = {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    photoURL: string;
  }[];
  pdfFileURL: string;
  isPublic: boolean;
  isArchived: boolean;
  createdAt: Date;
};
