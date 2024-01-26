import express from "express";
import pg from "pg";


import dotenv from "dotenv";
dotenv.config();

const app = express();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

app.use(express.static("public"));

app.get("/api/presidents", (_, res) => {
  client.query("SELECT * FROM president").then((data) => {
    res.json(data.rows);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}.`);
});