// @ts-nocheck
import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: "apps/api/prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@postgres:5432/devtodev?schema=public",
  },
});
