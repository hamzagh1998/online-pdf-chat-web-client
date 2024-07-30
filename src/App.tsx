import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router";

import { router } from "./routes";

import { ThemeProvider } from "./providers/theme-provider";

import { useUserData } from "./services/auth/queries";

import { useIsAuthenticated } from "./hooks/use-is-authenticated";

import { useUserStore } from "./hooks/store/use-user-store";

import { SplashScreen } from "./components/splash-screen";
import { Toaster } from "./components/ui/toaster";

export function App() {
  const { setUserData } = useUserStore();

  const isAuthenticated = useIsAuthenticated();

  const { data, error } = useUserData(!!isAuthenticated);

  if (error) {
    // TODO: Handle error
  }

  useEffect(() => {
    if (!data) return;

    setUserData(data);
  }, [data]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}
