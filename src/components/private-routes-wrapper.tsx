import { Navigate } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
import { AUTH_PATHES } from "@/routes/auth.routes";

import { SplashScreen } from "./splash-screen";

type PrivateRouteProps = {
  children: React.ReactNode;
};

export function PrivateRouteWrapper({ children }: PrivateRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={"/" + AUTH_PATHES.SIGNIN} />
  );
}
