import { create } from "zustand";

export type ConversationType = {
  id: string;
  name: string;
  owner: string;
  members: string[];
  participants: string[];
  isPublic: boolean;
  isArchived: boolean;
  createdAt: Date;
};

export type UserDataType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  storageUsageInMb: number;
  conversations: ConversationType[];
  plan: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type UserState = {
  userData?: UserDataType;
  setUserData: (data: UserDataType) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userData: undefined,
  setUserData: (data) => set(() => ({ userData: data })),
}));
