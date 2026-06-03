"use client";
/* Enhanced: quiet editorial dark sign-up card and amber-focused controls. */
import { SubmitHandler, useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useSignup } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const { createUserWithEmailAndPasswordAsync } = useSignup();
  const { register, handleSubmit } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    console.log(values);
    const { id } = await createUserWithEmailAndPasswordAsync({
      email: values.email,
      fullName: values.name,
      password: values.password,
    });

    router.replace("/dashboard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-4xl font-normal italic tracking-normal">
            Create your account.
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="name" className="font-mono text-xs text-[var(--text-muted)]">
                  Full Name
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name", { required: true })}
                />
              </Field>
              <Field className="gap-1.5">
                <FieldLabel htmlFor="email" className="font-mono text-xs text-[var(--text-muted)]">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: true })}
                />
              </Field>
              <Field className="gap-1.5">
                <Field className="grid grid-cols-2 gap-4">
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="password"
                      className="font-mono text-xs text-[var(--text-muted)]"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: true,
                        minLength: 8,
                      })}
                    />
                  </Field>
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="confirm-password"
                      className="font-mono text-xs text-[var(--text-muted)]"
                    >
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      {...register("confirmPassword", { required: true })}
                    />
                  </Field>
                </Field>
                <FieldDescription className="font-mono text-xs text-[var(--text-muted)]">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" className="font-mono">
                  Create Account
                </Button>
                <FieldDescription className="text-center text-[var(--text-secondary)]">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
                  >
                    Sign in
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-[var(--text-muted)]">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-[var(--text-secondary)]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-[var(--text-secondary)]">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
