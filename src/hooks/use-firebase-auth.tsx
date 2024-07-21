import { useState } from "react";

import {
  firebaseEmailSignin,
  firebaseEmailSignup,
} from "@/lib/firebase/auth/auth-with-email";
import {
  firebaseFacebookSignin,
  firebaseGithubSignin,
  firebaseGoogleSignin,
  firebaseMicrosoftSignin,
} from "@/lib/firebase/auth/auth-with-provider";

type AuthFunction = (
  email: string,
  password: string
) => Promise<{ error: boolean; detail: object | string | null }>;

type ProviderAuthFunction = () => Promise<{
  error?: boolean;
  detail?: string | object;
}>;

export function useFirebaseAuth() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (
    onAuth: AuthFunction,
    email: string,
    password: string
  ) => {
    setIsPending(true);
    const data = await onAuth(email, password);
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  const handleOAuth = async (onAuth: ProviderAuthFunction) => {
    const data = await onAuth();
    if (data.error) {
      setError(data.detail as string);
    }
    return data;
  };

  const onFirebaseEmailSignup = (email: string, password: string) => {
    if (!email || !password) {
      return setError("Email and password are required!");
    }
    return handleAuth(firebaseEmailSignup, email, password);
  };

  const onFirebaseEmailSignin = (email: string, password: string) => {
    if (!email || !password) {
      return setError("Email and password are required!");
    }
    return handleAuth(firebaseEmailSignin, email, password);
  };

  const onFirebaseGoogleSignin = () => handleOAuth(firebaseGoogleSignin);

  const onFirebaseFacebookSignin = () => handleOAuth(firebaseFacebookSignin);

  const onFirebaseGithubSignin = () => handleOAuth(firebaseGithubSignin);

  const onFIrebaserMicrosoftSignin = () => handleOAuth(firebaseMicrosoftSignin);

  return {
    isPending,
    error,
    onFirebaseEmailSignup,
    onFirebaseEmailSignin,
    onFirebaseGoogleSignin,
    onFIrebaserMicrosoftSignin,
    onFirebaseFacebookSignin,
    onFirebaseGithubSignin,
  };
}
