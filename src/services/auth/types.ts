import { ConversationType } from "@/hooks/store/common-types";

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
};
