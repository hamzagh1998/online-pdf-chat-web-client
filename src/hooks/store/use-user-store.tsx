import { create } from "zustand";

type UserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  storageUsageInMb: number;
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
