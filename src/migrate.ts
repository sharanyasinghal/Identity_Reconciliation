import { FileMigrationProvider, Migrator } from "kysely";
import path from "path";
import { promises as fs } from "fs";
import { db } from "./data/postgres/db";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, "data/postgres/migrations"),
  }),
});

migrator.migrateToLatest().then(({ error, results }) => {
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to run `migrateToLatest`");
    console.error(error);
  }
});
