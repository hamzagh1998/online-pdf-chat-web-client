import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ErrorAlert } from "@/components/error-alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { OauthSection } from "./oauth-section";

import { AUTH_PATHES } from "@/routes/auth.routes";

import { UserCredential } from "firebase/auth";

import { deleteFirebaseCurrentUser } from "@/lib/firebase/auth/auth-with-email";

import { signupSchemaType, signupSchema } from "@/schemas/auth";
import { useSignupUser } from "@/services/auth/queries";

export function SignupForm() {
  const { toast } = useToast();

  const {
    isPending,
    error,
    onFirebaseEmailSignup,
    onFirebaseGoogleSignin,
    onFirebaseFacebookSignin,
    onFirebaseGithubSignin,
  } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
  });

  const signupUserMutation = useSignupUser();

  const onEmailSignup: SubmitHandler<signupSchemaType> = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    try {
      const data = await onFirebaseEmailSignup(email, password);
      if (data?.error) return;
      //* Register user to db
      signupUserMutation.mutate({
        firstName: firstName.trim().toLowerCase(),
        lastName: lastName.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
      });
      return toast({
        description: "Verification email sent to Your Inbox!",
      });
    } catch (err) {
      deleteFirebaseCurrentUser(); // Remove the current user from Firebase in case registration fails in the database
      console.error("Signup failed", err);
    }
  };

  const onOAuthSignup = async (provider: "google" | "facebook" | "github") => {
    try {
      const data = await (provider === "google"
        ? onFirebaseGoogleSignin()
        : provider === "github"
        ? onFirebaseGithubSignin()
        : onFirebaseFacebookSignin());
      if (data?.error) return;
      const { displayName, email, photoURL } =
        data.detail as UserCredential["user"];
      const [firstName, lastName] = displayName?.split(" ") || ["", ""];
      //* Register user to db
      signupUserMutation.mutate({
        firstName: firstName.trim().toLowerCase(),
        lastName: lastName.trim().toLowerCase(),
        email: email?.trim().toLowerCase()!,
        photoURL: photoURL!,
      });
    } catch (err) {
      deleteFirebaseCurrentUser(); // Remove the current user from Firebase in case registration fails in the database
      console.error(`${provider} signup failed`, err);
    }
  };

  return (
    <Card>
      <CardHeader className="grid gap-2">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-balance text-muted-foreground">Create new account</p>
        {error && <ErrorAlert title="Sign In failed" description={error} />}
      </CardHeader>

      <CardContent className="space-y-6">
        <OauthSection onOAuthSignup={onOAuthSignup} isPending={isPending} />
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Separator orientation="horizontal" className="flex-1" />
          <p className="text-xs text-muted-foreground">OR CONTINUE WITH</p>
          <Separator orientation="horizontal" className="flex-1" />
        </div>
        <form onSubmit={handleSubmit(onEmailSignup)} className="space-y-6">
          <div className="flex justify-between items-start gap-2">
            <div className="w-full">
              <Label htmlFor="firstName">First name*</Label>
              <Input
                className={
                  errors.firstName && "border-destructive focus:border-accent"
                }
                id="firstName"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="lastName">Last name*</Label>
              <Input
                className={
                  errors.lastName && "border-destructive focus:border-accent"
                }
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="email*">Email*</Label>
              <Input
                className={
                  errors.password && "border-destructive focus:border-accent"
                }
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password*">Password*</Label>
              </div>
              <Input
                className={
                  errors.password && "border-destructive focus:border-accent"
                }
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full font-bold mt-4"
              disabled={isPending}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="text-sm">
        Already have an account?&ensp;
        <Link to={AUTH_PATHES.SIGNIN} className="underline">
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
