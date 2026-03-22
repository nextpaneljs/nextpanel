import path from "path";
import chalk from "chalk";
import { pascalCase, camelCase, pluralize } from "../utils/naming";
import { renderTemplate } from "../utils/template-engine";
import { writeFile, fileExists, readFile, findProjectRoot } from "../utils/fs-helpers";
import { findModel, getSchemaPath } from "../prisma/schema-parser";
import { mapFieldsToColumns, mapFieldsToFormFields, buildInclude } from "../prisma/field-mapper";

export interface ResourceOptions {
  fromModel?: boolean;
  group: string;
  icon: string;
}

export async function addResource(name: string, options: ResourceOptions) {
    const projectRoot = findProjectRoot();
    const resourceName = pascalCase(name);
    const resourceSlug = pluralize(name).toLowerCase();

    console.log(
      chalk.blue(`\nGenerating resource: ${chalk.bold(resourceName)}\n`)
    );

    // Determine columns and form fields
    let columns: Array<{
      key: string;
      label: string;
      type: string;
      sortable: boolean;
      searchable: boolean;
    }> = [];
    let formFields: Array<{
      key: string;
      label: string;
      type: string;
      required: boolean;
    }> = [];
    let defaultSortKey = "createdAt";
    let include: Record<string, unknown> | undefined;

    if (options.fromModel) {
      try {
        const schemaPath = getSchemaPath();
        const model = findModel(schemaPath, name);
        if (model) {
          columns = mapFieldsToColumns(model.fields);
          formFields = mapFieldsToFormFields(model.fields);
          include = buildInclude(model.fields);

          // Set default sort key
          const hasCreatedAt = model.fields.some(
            (f) => f.name === "createdAt"
          );
          defaultSortKey = hasCreatedAt ? "createdAt" : "id";

          console.log(
            chalk.green(
              `  Found Prisma model "${model.name}" with ${model.fields.length} fields`
            )
          );
        } else {
          console.log(
            chalk.yellow(
              `  Model "${name}" not found in Prisma schema. Using defaults.`
            )
          );
        }
      } catch (e) {
        console.log(
          chalk.yellow(
            `  Could not parse Prisma schema: ${(e as Error).message}. Using defaults.`
          )
        );
      }
    }

    // Fallback to basic columns if none found
    if (columns.length === 0) {
      columns = [
        {
          key: "id",
          label: "ID",
          type: "text",
          sortable: true,
          searchable: false,
        },
        {
          key: "name",
          label: "Name",
          type: "text",
          sortable: true,
          searchable: true,
        },
        {
          key: "createdAt",
          label: "Created",
          type: "date",
          sortable: true,
          searchable: false,
        },
      ];
      formFields = [
        { key: "name", label: "Name", type: "text", required: true },
      ];
    }

    const context = {
      name,
      icon: options.icon,
      group: options.group,
      sort: 10,
      columns,
      formFields,
      defaultSortKey,
      include,
    };

    // 1. Generate resource config file
    const resourcePath = path.join(
      projectRoot,
      "src",
      "resources",
      `${name.toLowerCase()}.resource.ts`
    );
    const resourceContent = renderTemplate("resource.ts.hbs", context);
    writeFile(resourcePath, resourceContent);
    console.log(chalk.green(`  Created ${resourcePath}`));

    // 2. Generate list page
    const listPagePath = path.join(
      projectRoot,
      "src",
      "app",
      "admin",
      resourceSlug,
      "page.tsx"
    );
    const listPageContent = renderTemplate("list-page.tsx.hbs", context);
    writeFile(listPagePath, listPageContent);
    console.log(chalk.green(`  Created ${listPagePath}`));

    // 3. Generate create page
    const createPagePath = path.join(
      projectRoot,
      "src",
      "app",
      "admin",
      resourceSlug,
      "create",
      "page.tsx"
    );
    const createPageContent = renderTemplate("create-page.tsx.hbs", context);
    writeFile(createPagePath, createPageContent);
    console.log(chalk.green(`  Created ${createPagePath}`));

    // 4. Generate edit page
    const editPagePath = path.join(
      projectRoot,
      "src",
      "app",
      "admin",
      resourceSlug,
      "[id]",
      "edit",
      "page.tsx"
    );
    const editPageContent = renderTemplate("edit-page.tsx.hbs", context);
    writeFile(editPagePath, editPageContent);
    console.log(chalk.green(`  Created ${editPagePath}`));

    // 5. Update resource registry
    updateRegistry(projectRoot, name);

    console.log(
      chalk.blue(
        `\n  Resource "${resourceName}" created successfully!`
      )
    );
    console.log(
      chalk.gray(
        `  Visit /admin/${resourceSlug} to see it in action.\n`
      )
    );
}

function updateRegistry(projectRoot: string, name: string) {
  const registryPath = path.join(
    projectRoot,
    "src",
    "resources",
    "index.ts"
  );

  if (!fileExists(registryPath)) {
    console.log(
      chalk.yellow("  Could not find resources/index.ts to update registry")
    );
    return;
  }

  let content = readFile(registryPath);
  const resourceName = pascalCase(name);
  const importName = `${resourceName}Resource`;
  const importPath = `./${name.toLowerCase()}.resource`;

  // Check if already imported
  if (content.includes(importName)) {
    console.log(chalk.gray(`  Registry already contains ${importName}`));
    return;
  }

  // Add import after the last import statement
  const importLine = `import { ${importName} } from "${importPath}";\n`;
  const lastImportIndex = content.lastIndexOf("import ");
  if (lastImportIndex !== -1) {
    const endOfLine = content.indexOf("\n", lastImportIndex);
    content =
      content.slice(0, endOfLine + 1) +
      importLine +
      content.slice(endOfLine + 1);
  } else {
    content = importLine + content;
  }

  // Add to resources array
  content = content.replace(
    /export const resources: ResourceConfig\[\] = \[([\s\S]*?)\];/,
    (match, arrayContent) => {
      const trimmed = arrayContent.trim();
      if (trimmed === "") {
        return `export const resources: ResourceConfig[] = [\n  ${importName},\n];`;
      }
      // Add comma if needed
      const items = trimmed.endsWith(",") ? trimmed : trimmed + ",";
      return `export const resources: ResourceConfig[] = [\n  ${items}\n  ${importName},\n];`;
    }
  );

  writeFile(registryPath, content);
  console.log(chalk.green(`  Updated resources/index.ts`));
}
