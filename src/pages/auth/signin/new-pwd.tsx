import { AuthLayout } from "../_layout";
import { NewPwdForm } from "./components/new-pwd-form";

export function NewPasswordPage() {
  return (
    <AuthLayout bgImage="/reset-pwd-illustration.svg">
      <NewPwdForm />
    </AuthLayout>
  );
}
