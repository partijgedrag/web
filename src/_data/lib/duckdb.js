import { DuckDBInstance } from "@duckdb/node-api";
import fs from "node:fs";

/**
 * Check that all required files exist.
 * Returns the list of missing paths (empty array = all present).
 */
export function checkFiles(filePaths, context = "") {
  const missing = filePaths.filter((f) => !fs.existsSync(f));
  if (missing.length > 0) {
    const prefix = context ? `${context}: ` : "";
    console.error(`${prefix}missing file(s):`);
    missing.forEach((f) => console.error(` - ${f}`));
  }
  return missing;
}

/**
 * Create a DuckDB in-memory connection.
 */
export async function createConnection() {
  const instance = await DuckDBInstance.create(":memory:");
  return instance.connect();
}

/**
 * Read a single parquet file and return its rows.
 */
export async function readParquet(connection, filePath) {
  const result = await connection.runAndReadAll(
    `SELECT * FROM read_parquet('${filePath}')`,
  );
  return result.getRows();
}

/**
 * Read multiple parquet files in parallel and return a named map of rows.
 *
 * @param {import('@duckdb/node-api').DuckDBConnection} connection
 * @param {Record<string, string>} fileMap  e.g. { members: '/path/to/members.parquet', ... }
 * @returns {Promise<Record<string, any[][]>>}
 */
export async function readParquets(connection, fileMap) {
  const entries = Object.entries(fileMap);
  const rows = await Promise.all(
    entries.map(([, filePath]) => readParquet(connection, filePath)),
  );
  return Object.fromEntries(entries.map(([key], i) => [key, rows[i]]));
}

/**
 * High-level helper: checks files, creates a connection, runs your loader fn,
 * and wraps everything in a try/catch that returns `fallback` on failure.
 *
 * @param {object}   opts
 * @param {string[]} opts.requiredFiles   paths that must exist before running
 * @param {function} opts.loader          async (connection) => yourReturnValue
 * @param {any}      opts.fallback        returned when files are missing or an error is thrown
 * @param {string}  [opts.context]        label shown in error messages
 */
export async function withParquets(
  { requiredFiles, loader, fallback, context = "" },
) {
  const missing = checkFiles(requiredFiles, context);
  if (missing.length > 0) return fallback;

  try {
    const connection = await createConnection();
    return await loader(connection);
  } catch (error) {
    console.error(`${context ? context + ": " : ""}error loading data:`, error);
    return fallback;
  }
}
