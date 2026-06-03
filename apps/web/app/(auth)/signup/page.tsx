/* Enhanced: full-viewport quiet editorial sign-up shell. */
import { GalleryVerticalEnd } from "lucide-react";

import { SignupForm } from "~/components/signup-form";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-[var(--bg)] px-4 py-6 text-foreground md:px-6 md:py-8">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full animate-[pulse_12s_ease-in-out_infinite] bg-[var(--accent)]" />
      </div>
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-serif text-xl italic">
          <div className="flex size-6 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
