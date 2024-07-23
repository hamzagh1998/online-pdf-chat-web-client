import { useState } from "react";

import {
  firebaseConfirmPasswordReset,
  firebaseEmailSignin,
  firebaseEmailSignup,
  firebasePasswordResetEmail,
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
    setIsPending(true);
    const data = await onAuth();
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
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

  const onFirebasePasswordResetEmail = async (email: string) => {
    setIsPending(true);
    const data = await firebasePasswordResetEmail(email);
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  const onFirebaseConfirmPasswordReset = async (
    oobCode: string,
    newPassword: string
  ) => {
    setIsPending(true);
    const data = await firebaseConfirmPasswordReset(oobCode, newPassword);
    if (data.error) {
      setError(data.detail as string);
    }
    setIsPending(false);
    return data;
  };

  return {
    isPending,
    error,
    onFirebaseEmailSignup,
    onFirebaseEmailSignin,
    onFirebaseGoogleSignin,
    onFIrebaserMicrosoftSignin,
    onFirebaseFacebookSignin,
    onFirebaseGithubSignin,
    firebasePasswordResetEmail,
    onFirebasePasswordResetEmail,
    onFirebaseConfirmPasswordReset,
  };
}
