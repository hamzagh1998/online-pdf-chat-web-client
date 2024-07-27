import { RouteObject } from "react-router";

import { SigninPage } from "@/pages/auth/signin";
import { SignupPage } from "@/pages/auth/signup";
import { ForgetPasswordPage } from "@/pages/auth/forget-pwd";
import { NewPasswordPage } from "@/pages/auth/new-pwd";

export const AUTH_PATHES = {
  SIGNUP: "/signup",
  SIGNIN: "/signin",
  FORGET_PASSWORD: "/reset-password",
  NEW_PASSWORD: "/new-password",
};

export const authRoutes: RouteObject[] = [
  {
    path: AUTH_PATHES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: AUTH_PATHES.SIGNIN,
    element: <SigninPage />,
  },
  {
    path: AUTH_PATHES.FORGET_PASSWORD,
    element: <ForgetPasswordPage />,
  },
  {
    path: AUTH_PATHES.NEW_PASSWORD,
    element: <NewPasswordPage />,
  },
];
