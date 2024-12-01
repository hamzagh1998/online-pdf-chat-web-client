import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
import { useUserStore } from "@/hooks/store/use-user-store";

import { MAIN_PATHES } from "@/routes/main.routes";

import { useAddUserToConversation } from "@/services/conversation/queries";

import { SplashScreen } from "./splash-screen";

interface AuthRouteProps {
  children: React.ReactNode;
}

export function AuthRouteWrapper({ children }: AuthRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  const location = useLocation();
  const navigate = useNavigate();

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
