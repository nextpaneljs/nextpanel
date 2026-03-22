"use server";

import { createCrudActions, createQueryActions } from "@nextpaneljs/core/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { resources } from "@/resources";

const config = { prisma, auth, resources };

export const { createRecord, updateRecord, deleteRecord, getRelationOptions } =
  createCrudActions(config);

export const { queryRecords } = createQueryActions(config);
