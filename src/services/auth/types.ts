export type Signup = {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  storageUsageInMb: number;
  plan: string;
  createdAt: Date;
  updatedAt: Date | null;
};
