"use client";

import { AdminTopbar } from "@nextpaneljs/core/layout";
import { authClient } from "@/lib/auth-client";

interface AdminTopbarWrapperProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AdminTopbarWrapper({ user }: AdminTopbarWrapperProps) {
  return (
    <AdminTopbar
      user={user}
      onSignOut={async () => {
        await authClient.signOut();
      }}
    />
  );
}
