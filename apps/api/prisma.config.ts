// @ts-nocheck
import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@postgres:5432/devtodev?schema=public",
  },
});
