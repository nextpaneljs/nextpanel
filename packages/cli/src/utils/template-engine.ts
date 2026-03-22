import Handlebars from "handlebars";
import path from "path";
import { readFile } from "./fs-helpers";
import { pascalCase, camelCase, pluralize } from "./naming";

// Register helpers
Handlebars.registerHelper("pascalCase", (str: string) => pascalCase(str));
Handlebars.registerHelper("camelCase", (str: string) => camelCase(str));
Handlebars.registerHelper("pluralize", (str: string) => pluralize(str));
Handlebars.registerHelper("lowercase", (str: string) => str.toLowerCase());
Handlebars.registerHelper(
  "eq",
  (a: unknown, b: unknown) => a === b
);

export function renderTemplate(
  templateName: string,
  context: Record<string, unknown>
): string {
  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    templateName
  );
  const templateContent = readFile(templatePath);
  const template = Handlebars.compile(templateContent);
  return template(context);
}

export function renderString(
  templateStr: string,
  context: Record<string, unknown>
): string {
  const template = Handlebars.compile(templateStr);
  return template(context);
}
