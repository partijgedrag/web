import { DuckDBInstance } from "@duckdb/node-api";
import fs from "node:fs";

export default async function () {
  try {
    const lobbyFilePath = "src/data/lobby.parquet";

    if (!fs.existsSync(lobbyFilePath)) {
      console.error("Parquet file(s) not found.");
      return { lobby: [] };
    }

    const instance = await DuckDBInstance.create(":memory:");
    const connection = await instance.connect();

    const lobbyResult = await connection.runAndReadAll(
      `SELECT * FROM read_parquet('${lobbyFilePath}')`,
    );
    const lobbyRows = lobbyResult.getRows();

    let lobbies = [];

    lobbyRows.forEach((row) => {
      lobbies.push({
        name: row[0],
        contacts: row[1],
        interests: row[2],
        url: row[3],
      });
    });

    // await connection.close();

    return { lobby: lobbies };
  } catch (error) {
    console.error("Error reading Parquet file:", error);
    return { lobby: [] };
  }
}
