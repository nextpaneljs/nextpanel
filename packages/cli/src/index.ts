#!/usr/bin/env node

import { Command } from "commander";
import { addResource } from "./commands/make-resource";
import { addModel } from "./commands/make-model";
import { init } from "./commands/init";

const program = new Command();

program
  .name("nextpanel")
  .description("Filament-inspired admin panel generator for Next.js")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize NextPanel in your Next.js project")
  .action(init);

// npx nextpanel add resource <Name>
// npx nextpanel add model <Name>
const add = program.command("add").description("Add a resource or model to your project");

add
  .command("resource <name>")
  .description("Generate a new resource with CRUD pages")
  .option("--from-model", "Auto-generate from Prisma model")
  .option("--group <group>", "Navigation group", "Resources")
  .option("--icon <icon>", "Lucide icon name", "File")
  .action(addResource);

add
  .command("model <name>")
  .description("Add a new model to the Prisma schema")
  .option("--no-timestamps", "Skip createdAt/updatedAt fields")
  .action(addModel);

program.parse();
