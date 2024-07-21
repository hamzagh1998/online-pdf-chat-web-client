import { createBrowserRouter, RouteObject } from "react-router-dom";

import { MarketingPage } from "@/pages/marketing/marketing";
import { authRoutes } from "./auth.routes";
import { mainRoutes } from "./main.routes";

import { ErrorPage } from "@/pages/error";
import { NotFoundPage } from "@/pages/not-found";

import { PrivateRouteWrapper } from "@/components/private-routes-wrapper";
import { AuthRouteWrapper } from "@/components/auth-routes-wrapper";

//* All private routes goes here
const privateRoutesWrapper: RouteObject[] = mainRoutes.map((route) => ({
  ...route,
  element: <PrivateRouteWrapper>{route.element}</PrivateRouteWrapper>,
}));

//* All authentications routes goes here
const authRoutesWrapper: RouteObject[] = authRoutes.map((route) => ({
  ...route,
  element: <AuthRouteWrapper>{route.element}</AuthRouteWrapper>,
}));

// Combine all routes
const routes: RouteObject[] = [
  {
    children: [
      ...privateRoutesWrapper,
      ...authRoutesWrapper,
      { path: "/", element: <MarketingPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
    errorElement: <ErrorPage />,
  },
];

//* Create the router instance
export const router = createBrowserRouter(routes);
