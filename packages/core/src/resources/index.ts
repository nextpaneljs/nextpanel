import type { ResourceConfig } from "../types";
import type { NavItem } from "../layout/admin-sidebar";

export function getResourceBySlug(
  resources: ResourceConfig[],
  slug: string
): ResourceConfig | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getNavigationItems(resources: ResourceConfig[]): NavItem[] {
  return resources
    .map((r) => ({
      label: r.pluralLabel,
      href: `/admin/${r.slug}`,
      icon: r.icon,
      group: r.navigation.group,
      sort: r.navigation.sort,
    }))
    .sort((a, b) => a.sort - b.sort);
}
