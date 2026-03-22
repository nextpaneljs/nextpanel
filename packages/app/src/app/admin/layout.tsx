import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@nextpaneljs/core/ui";
import { AdminSidebar } from "@nextpaneljs/core/layout";
import { getNavigationItems } from "@/resources";
import { Toaster } from "@nextpaneljs/core/ui";
import { AdminTopbarWrapper } from "./admin-topbar-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const navItems = getNavigationItems();

  return (
    <SidebarProvider>
      <AdminSidebar items={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbarWrapper user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
