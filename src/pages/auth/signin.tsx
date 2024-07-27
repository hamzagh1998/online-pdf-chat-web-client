import { AuthLayout } from "./_layout";
import { SigninForm } from "./components/signin-form";

export function SigninPage() {
  return (
    <AuthLayout bgImage="/auth-illustration.svg">
      <SigninForm />
    </AuthLayout>
  );
}
