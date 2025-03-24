import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/modules/**/*.schema.ts",
  out: "./src/modules/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;
