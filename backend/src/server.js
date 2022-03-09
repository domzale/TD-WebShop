require("dotenv").config();
const express = require("express");
const { DatabasePool } = require("./database");

const app = express();
const port = 8080;
const pool = new DatabasePool();

app.use("/", require("./routers"));

app.listen(port, async () => {
  await pool.setupTablesAndData();
  console.log("Server started");
});
