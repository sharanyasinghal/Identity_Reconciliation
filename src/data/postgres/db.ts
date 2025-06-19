import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen/dist/db";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
