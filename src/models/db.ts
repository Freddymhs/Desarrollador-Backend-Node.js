import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DB_PATH } from "@config/index";

type DB = Database<sqlite3.Database, sqlite3.Statement>;

const dbPromise: Promise<DB> = open({
  filename: DB_PATH,
  driver: sqlite3.Database,
});

const getDatabase = (): Promise<DB> => dbPromise;

export { getDatabase };
