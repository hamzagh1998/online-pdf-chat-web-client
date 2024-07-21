import { RouteObject } from "react-router";

import { SigninPage } from "@/pages/auth/signin/signin";
import { SignupPage } from "@/pages/auth/signin/signup";
import { ForgetPasswordPage } from "@/pages/auth/signin/forget-pwd";

export const AUTH_PATHES = {
  SIGNUP: "/signup",
  SIGNIN: "/signin",
  FORGET_PASSWORD: "/reset-password",
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
];
