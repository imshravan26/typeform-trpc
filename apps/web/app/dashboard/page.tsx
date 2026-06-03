/* Enhanced: quiet editorial dashboard overview surface. */
import { ChartAreaInteractive } from "~/components/chart-area-interactive";
import { SectionCards } from "~/components/section-cards";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--bg)]">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
          <div className="space-y-1">
            <h2 className="font-serif text-[2.5rem] font-normal italic leading-none tracking-normal">
              Dashboard
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              A quiet overview of form activity and response movement.
            </p>
          </div>
          <SectionCards />
          <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
