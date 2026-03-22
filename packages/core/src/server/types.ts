import type { ResourceConfig } from "../types";

export interface NextPanelServerConfig {
  prisma: unknown;
  auth: {
    api: {
      getSession: (opts: { headers: Headers }) => Promise<{ user: unknown } | null>;
    };
  };
  resources: ResourceConfig[];
}
