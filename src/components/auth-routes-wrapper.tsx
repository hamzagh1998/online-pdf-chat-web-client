import { Navigate } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
import { MAIN_PATHES } from "@/routes/main.routes";
import { SplashScreen } from "./splash-screen";

interface AuthRouteProps {
  children: React.ReactNode;
}

export function AuthRouteWrapper({ children }: AuthRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <Navigate to={"/" + MAIN_PATHES.MAIN} /> : children;
}
