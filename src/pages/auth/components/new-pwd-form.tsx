import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorAlert } from "@/components/error-alert";

import { newPwdSchema, newPwdSchemaType } from "@/schemas/auth";

import { AUTH_PATHES } from "@/routes/auth.routes";
import { useEffect } from "react";

export function NewPwdForm() {
  const queryParams = new URLSearchParams(window.location.search);
  const oobCode = queryParams.get("oobCode");

  const navigae = useNavigate();

  const { isPending, error, onFirebaseConfirmPasswordReset } =
    useFirebaseAuth();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<newPwdSchemaType>({
    resolver: zodResolver(newPwdSchema),
  });

  const onSendResetEmail: SubmitHandler<newPwdSchemaType> = async ({
    password,
  }) => {
    const res = await onFirebaseConfirmPasswordReset(oobCode!, password);
    toast({
      description: res.detail,
    });
    navigae(AUTH_PATHES.SIGNIN);
  };

  useEffect(() => {
    if (!oobCode) {
      navigae(AUTH_PATHES.SIGNIN);
    }
  }, []);

  return (
    <Card>
      <CardHeader className="grid gap-2">
        <Link to={AUTH_PATHES.SIGNIN}>
          <p className="flex justify-start items-center gap-2 text-sm font-bold cursor-pointer text-muted-foreground max-sm:underline hover:underline hover:text-foreground">
            <FaArrowLeft />
            Sign In
          </p>
        </Link>
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">Enter your email</p>
        {error && <ErrorAlert title="Sign In failed" description={error} />}
      </CardHeader>
      <CardContent className="grid gap-2">
        <form onSubmit={handleSubmit(onSendResetEmail)}>
          <Label htmlFor="password*">Password*</Label>
          <Input
            className={
              errors.password && "border-destructive focus:border-accent"
            }
            id="password"
            type="password"
            placeholder="m@example.com"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <Label htmlFor="confirmPassword*">Confirm Password*</Label>
          <Input
            className={
              errors.confirmPassword && "border-destructive focus:border-accent"
            }
            id="confirmPassword"
            type="password"
            placeholder="m@example.com"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full font-bold mt-4"
            disabled={isPending}
          >
            Send Reset Email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
