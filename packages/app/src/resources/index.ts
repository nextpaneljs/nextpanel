import type { ResourceConfig } from "@nextpaneljs/core";
import { getNavigationItems as getNavItems } from "@nextpaneljs/core/resources";
import { PostResource } from "./post.resource";
import { CategoryResource } from "./category.resource";

// Resources are registered here by the CLI when running `nextpanel add resource`
// Import and add your resources to the array below.

export const resources: ResourceConfig[] = [
  PostResource,
  CategoryResource,
];

export function getResourceBySlug(slug: string): ResourceConfig | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getNavigationItems() {
  return getNavItems(resources);
}
