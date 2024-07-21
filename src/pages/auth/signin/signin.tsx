import { AuthLayout } from "../_layout";
import { SigninForm } from "./components/signin-form";

export function SigninPage() {
  return (
    <AuthLayout>
      <SigninForm />
    </AuthLayout>
  );
}
