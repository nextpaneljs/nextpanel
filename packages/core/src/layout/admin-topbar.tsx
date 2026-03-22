import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { UserMenu } from "./user-menu";
import { AdminBreadcrumbs } from "./breadcrumbs";

interface AdminTopbarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  onSignOut: () => Promise<void>;
}

export function AdminTopbar({ user, onSignOut }: AdminTopbarProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <AdminBreadcrumbs />
      <div className="ml-auto">
        <UserMenu user={user} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
