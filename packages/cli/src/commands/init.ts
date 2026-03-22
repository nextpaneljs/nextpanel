import path from "path";
import chalk from "chalk";
import { renderTemplate } from "../utils/template-engine";
import { writeFile, fileExists, findProjectRoot } from "../utils/fs-helpers";

export async function init() {
  const projectRoot = findProjectRoot();

  console.log(chalk.blue("\nInitializing NextPanel...\n"));

  // Generate actions file
  const actionsPath = path.join(projectRoot, "src", "nextpanel", "actions.ts");

  if (fileExists(actionsPath)) {
    console.log(chalk.yellow("  src/nextpanel/actions.ts already exists, skipping."));
  } else {
    const actionsContent = renderTemplate("actions.ts.hbs", {});
    writeFile(actionsPath, actionsContent);
    console.log(chalk.green("  Created src/nextpanel/actions.ts"));
  }

  // Generate resources index if it doesn't exist
  const resourcesIndexPath = path.join(projectRoot, "src", "resources", "index.ts");

  if (fileExists(resourcesIndexPath)) {
    console.log(chalk.yellow("  src/resources/index.ts already exists, skipping."));
  } else {
    const resourcesContent = `import type { ResourceConfig } from "@nextpaneljs/core";

// Resources are registered here by the CLI when running \`nextpanel add resource\`
// Import and add your resources to the array below.

export const resources: ResourceConfig[] = [];
`;
    writeFile(resourcesIndexPath, resourcesContent);
    console.log(chalk.green("  Created src/resources/index.ts"));
  }

  console.log(chalk.blue("\n  NextPanel initialized successfully!"));
  console.log(chalk.gray("  Next steps:"));
  console.log(chalk.gray("    1. Create a Prisma model: npx nextpanel add model Post"));
  console.log(chalk.gray("    2. Run migrations: npx prisma db push"));
  console.log(chalk.gray("    3. Generate a resource: npx nextpanel add resource Post --from-model\n"));
}
