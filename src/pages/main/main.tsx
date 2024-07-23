import { auth } from "@/lib/firebase/firebase.config";

import { Button } from "@/components/ui/button";

export function MainPage() {
  const signout = () => auth.signOut();
  return (
    <Button variant="default" onClick={signout}>
      Signout
    </Button>
  );
}
