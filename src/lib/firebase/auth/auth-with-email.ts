import {
  getAuth,
  createUserWithEmailAndPassword,
  AuthError,
  signInWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";

import { auth } from "../firebase.config";

type FirebaseAuthErrors = {
  [key: string]: string;
};

export const firebaseAuthenticationAPIErrors: FirebaseAuthErrors = {
  "Firebase: Error (auth/email-already-in-use).":
    "The provided email is already in use by an existing user!",
  "Firebase: Error (auth/email-already-exists).":
    "The provided email is already in use by an existing user!",
  "Firebase: Error (auth/id-token-expired).":
    "The provided ID token is expired!",
  "Firebase: Error (auth/invalid-email).": "Invalid email",
  "Firebase: Error (auth/invalid-password).": "Invalid password!",
  "Firebase: Error (auth/invalid-credential).": "Invalid credential!",
  "Firebase: Error (auth/internal-error).": "Unexpected error!",
};

export type UserData = {
  accessToken: string;
  email: string;
};

export async function firebaseEmailSignup(email: string, password: string) {
  const data: { error: boolean; detail: object | string | null } = {
    error: false,
    detail: null,
  };

  try {
    // Signed up
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    data.error = false;
    data.detail = userCredential.user;
    sendEmailVerificationToUser(); // Send verification email
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

export async function firebaseEmailSignin(email: string, password: string) {
  const data: { error: boolean; detail: object | string | null } = {
    error: false,
    detail: null,
  };

  try {
    // Signed in
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    data.error = false;
    data.detail = userCredential.user;
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

// Remove the current user from Firebase in case registration fails in the database
export async function deleteFirebaseCurrentUser() {
  return await deleteUser(auth.currentUser!);
}

// Send email verification
export function sendEmailVerificationToUser() {
  return sendEmailVerification(auth.currentUser!);
}

// send reset password email
export async function firebasePasswordResetEmail(email: string) {
  const data: { error: boolean; detail: string | null } = {
    error: false,
    detail: null,
  };

  try {
    await sendPasswordResetEmail(auth, email);
    data.error = false;
    data.detail = "Password reset link sent to your email! Check your inbox.";
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}

// New Password
export async function firebaseConfirmPasswordReset(
  oobCode: string,
  newPassword: string
) {
  const data: { error: boolean; detail: string | null } = {
    error: false,
    detail: null,
  };

  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    data.error = false;
    data.detail = "Password has been reset successfully!";
  } catch (error) {
    const errorMessage = (error as AuthError).message;
    data.error = true;
    data.detail =
      firebaseAuthenticationAPIErrors[errorMessage] ||
      "Unexpected error occurred!";
  }

  return data;
}
