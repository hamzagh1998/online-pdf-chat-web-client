import { AuthLayout } from "./_layout";
import { ForgetPwdForm } from "./components/forget-pwd-form";

export function ForgetPasswordPage() {
  return (
    <AuthLayout bgImage="/reset-pwd-illustration.svg">
      <ForgetPwdForm />
    </AuthLayout>
  );
}
