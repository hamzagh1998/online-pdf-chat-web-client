import { Suspense } from "react";
import { RouterProvider } from "react-router";

import { router } from "./routes";

import { ThemeProvider } from "./providers/theme-provider";

import { SplashScreen } from "./components/ui/splash-screen";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}
