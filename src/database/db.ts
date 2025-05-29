import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

type DB = Database<sqlite3.Database, sqlite3.Statement>;

const dbPromise: Promise<DB> = open({
  filename: process.env.DB_PATH || "./src/database/tasks.db",
  driver: sqlite3.Database,
});

const getDatabase = (): Promise<DB> => dbPromise;

export { getDatabase };
