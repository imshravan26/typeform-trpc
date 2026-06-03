import { CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";

type Props = {
  formTitle: string;
  onReset?: () => void;
};

export function ThankYouScreen({ formTitle, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--surface)]">
        <CheckCircle2 className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-5xl font-normal italic tracking-normal">Thank you.</h2>
        <p className="max-w-sm text-sm text-[var(--text-secondary)]">
          Thanks for filling out <span className="font-medium text-foreground">{formTitle}</span>.
          Your response has been recorded.
        </p>
      </div>
      {onReset && (
        <Button variant="outline" onClick={onReset}>
          Submit another response
        </Button>
      )}
    </div>
  );
}
