import { CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";

type Props = {
  formTitle: string;
  onReset?: () => void;
};

export function ThankYouScreen({ formTitle, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">You're all done!</h2>
        <p className="max-w-sm text-muted-foreground">
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
