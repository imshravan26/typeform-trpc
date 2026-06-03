/* Enhanced: quiet editorial dashboard metric cards without gradients. */
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]">
        <CardHeader>
          <CardDescription className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            Total Revenue
          </CardDescription>
          <CardTitle className="font-mono text-2xl font-semibold tabular-nums text-[var(--accent)] @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-[var(--text-secondary)]">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-[var(--text-muted)]">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]">
        <CardHeader>
          <CardDescription className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            New Customers
          </CardDescription>
          <CardTitle className="font-mono text-2xl font-semibold tabular-nums text-[var(--accent)] @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-[var(--text-secondary)]">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-[var(--text-muted)]">Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]">
        <CardHeader>
          <CardDescription className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            Active Accounts
          </CardDescription>
          <CardTitle className="font-mono text-2xl font-semibold tabular-nums text-[var(--accent)] @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-[var(--text-secondary)]">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-[var(--text-muted)]">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]">
        <CardHeader>
          <CardDescription className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            Growth Rate
          </CardDescription>
          <CardTitle className="font-mono text-2xl font-semibold tabular-nums text-[var(--accent)] @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm text-[var(--text-secondary)]">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-[var(--text-muted)]">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
