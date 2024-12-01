import { Navigate, useLocation } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

import { MAIN_PATHES } from "@/routes/main.routes";

import { SplashScreen } from "./splash-screen";

interface AuthRouteProps {
  children: React.ReactNode;
}

export function AuthRouteWrapper({ children }: AuthRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const collaborate = searchParams.get("collaborate");

  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return isAuthenticated ? (
    <Navigate
      to={
        "/" + (collaborate ? "?collaborate=" + collaborate : MAIN_PATHES.MAIN)
      }
    />
  ) : (
    children
  );
}
