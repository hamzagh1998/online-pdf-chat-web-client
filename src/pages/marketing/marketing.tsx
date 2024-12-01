import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

import { useAddUserToConversation } from "@/services/conversation/queries";

import { useUserStore } from "@/hooks/store/use-user-store";

import { Hero } from "./components/Hero";
import { Navbar } from "./components/navbar";
import { SplashScreen } from "@/components/splash-screen";

import { AUTH_PATHES } from "@/routes/auth.routes";
import { MAIN_PATHES } from "@/routes/main.routes";

export function MarketingPage() {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const mode = queryParams.get("mode");
  const oobCode = queryParams.get("oobCode");
  const collaborate = queryParams.get("collaborate");

  const isAuthenticated = useIsAuthenticated();

  const { userData } = useUserStore();

  const addUserToConversation = useAddUserToConversation();

  const onAddUserToConversation = async (conversationId: string) => {
    try {
      await addUserToConversation.mutateAsync({
        conversationId,
        userId: userData!.id,
      });
      localStorage.setItem("convId", JSON.stringify(conversationId));
      navigate(MAIN_PATHES.MAIN);
    } catch (error) {
      console.error("Failed to add user to conversation:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated === null) return;

    if (collaborate && !isAuthenticated) {
      navigate(`${AUTH_PATHES.SIGNIN}?collaborate=${collaborate}`);
    }

    if (mode === "resetPassword") {
      navigate(`${AUTH_PATHES.NEW_PASSWORD}?oobCode=${oobCode}`);
    }

    if (collaborate && isAuthenticated && userData) {
      onAddUserToConversation(collaborate);
    }
  }, [isAuthenticated, mode, oobCode, collaborate, userData]);

  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
