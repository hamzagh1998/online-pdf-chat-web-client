import { create } from "zustand";

type RoleType = {
  _id: string;
  userId: string;
  entreprise: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
};

export type UserData = {
  roles: RoleType[];
  user: UserType;
};

type UserState = {
  userData?: UserData;
  setUserData: (data: UserData) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userData: undefined,
  setUserData: (data) => set(() => ({ userData: data })),
}));
