/* Enhanced: quiet editorial dashboard top bar with wordmark and primary action. */
import Link from "next/link";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--bg)] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-foreground" />
        <Separator
          orientation="vertical"
          className="mx-2 bg-[var(--border)] data-[orientation=vertical]:h-4"
        />
        <h1 className="font-serif text-2xl italic tracking-normal text-[var(--text-primary)]">
          Forms
        </h1>
        <div className="ml-auto flex items-center gap-3">
          <Avatar className="size-8 rounded-sm border border-[var(--border)]">
            <AvatarFallback className="rounded-sm bg-[var(--surface)] font-mono text-xs text-[var(--text-secondary)]">
              AC
            </AvatarFallback>
          </Avatar>
          <Button asChild size="sm" className="font-mono">
            <Link href="/dashboard/forms">New form</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
