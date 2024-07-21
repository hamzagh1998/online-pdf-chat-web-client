// useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase/firebase.config";

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Ensures isAuthenticated is always a boolean
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return isAuthenticated;
}
