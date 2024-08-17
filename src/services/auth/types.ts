import { ConversationType } from "@/hooks/store/use-user-store";

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
};
