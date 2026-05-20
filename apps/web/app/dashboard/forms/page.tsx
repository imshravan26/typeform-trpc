import { IconDotsVertical, IconEye, IconFileText, IconPencil, IconPlus } from "@tabler/icons-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const forms = [];

export default function FormsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between gap-3 px-4 lg:px-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Forms</h2>
              <p className="text-sm text-muted-foreground">
                Create, edit, and review your form responses.
              </p>
            </div>
            <Button size="sm">
              <IconPlus />
              New Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
