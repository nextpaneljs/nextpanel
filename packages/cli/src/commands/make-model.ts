import path from "path";
import chalk from "chalk";
import { pascalCase } from "../utils/naming";
import { readFile, writeFile, fileExists } from "../utils/fs-helpers";
import { getSchemaPath } from "../prisma/schema-parser";

export interface ModelOptions {
  timestamps?: boolean;
}

export async function addModel(name: string, options: ModelOptions) {
  const modelName = pascalCase(name);

  // Check if model already exists in schema
  let schemaPath: string;
  try {
    schemaPath = getSchemaPath();
  } catch {
    schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  }

  if (!fileExists(schemaPath)) {
    console.log(chalk.red(`\n  Error: Prisma schema not found at ${schemaPath}`));
    console.log(chalk.gray(`  Make sure you're in your Next.js project root.\n`));
    return;
  }

  const currentSchema = readFile(schemaPath);

  // Check for duplicate model
  const modelRegex = new RegExp(`^model\\s+${modelName}\\s*\\{`, "m");
  if (modelRegex.test(currentSchema)) {
    console.log(chalk.red(`\n  Error: Model "${modelName}" already exists in schema.prisma`));
    console.log(chalk.gray(`  Edit the existing model directly in ${schemaPath}\n`));
    return;
  }

  // Scaffold model with sensible defaults — user edits afterward
  let modelStr = `\nmodel ${modelName} {\n`;
  modelStr += `  id        String   @id @default(cuid())\n`;
  modelStr += `  name      String\n`;

  if (options.timestamps !== false) {
    modelStr += `  createdAt DateTime @default(now())\n`;
    modelStr += `  updatedAt DateTime @updatedAt\n`;
  }

  modelStr += `}\n`;

  // Append to schema
  writeFile(schemaPath, currentSchema + modelStr);

  console.log(chalk.green(`\n  Model "${modelName}" added to ${schemaPath}`));
  console.log(chalk.gray(`\n  Next steps:`));
  console.log(chalk.gray(`    1. Edit the model in prisma/schema.prisma to add your fields`));
  console.log(chalk.gray(`    2. Run "npx prisma db push" to apply changes`));
  console.log(chalk.gray(`    3. Run "npx nextpanel add resource ${modelName} --from-model" to generate the admin panel\n`));
}
