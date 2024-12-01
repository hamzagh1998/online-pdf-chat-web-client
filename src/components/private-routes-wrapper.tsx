import { Navigate, useLocation } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

import { AUTH_PATHES } from "@/routes/auth.routes";

import { SplashScreen } from "./splash-screen";

export function PrivateRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const collaborate = searchParams.get("collaborate");

  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return isAuthenticated && !collaborate ? (
    children
  ) : (
    <Navigate
      to={
        AUTH_PATHES.SIGNIN + (collaborate ? "?collaborate=" + collaborate : "")
      }
    />
  );
}
