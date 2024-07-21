import { AuthLayout } from "../_layout";
import { SignupForm } from "./components/signup-form";

export function SignupPage() {
  return (
    <AuthLayout bgImage="/auth-illustration.svg">
      <SignupForm />
    </AuthLayout>
  );
}
