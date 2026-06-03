/* Enhanced: full-viewport quiet editorial sign-in shell. */
import { LoginForm } from "~/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-6 text-foreground md:px-6 md:py-8">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full animate-[pulse_12s_ease-in-out_infinite] bg-[var(--accent)]" />
      </div>
      <div className="relative w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
