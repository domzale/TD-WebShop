const { Pool } = require("postgres-pool"),
  fs = require("fs");

const defHost =
    process.env.IS_LOCAL_DEV === "true" ? "127.0.0.1:5432" : "postgres:5432",
  defUser = "trnbus",
  defPass = "d0m4z37",
  defDb = "baza",
  enc = "utf-8",
  createSqlLoc = "./sql/create.sql",
  insertSqlLoc = "./sql/init.sql";

class DatabasePool {
  #pool;

  constructor() {
    this.#pool = new Pool({
      connectionString: `postgres://${defUser}:${defPass}@${defHost}/${defDb}`,
    });
  }

  get() {
    return this.#pool;
  }

  async #getTablesCount() {
    let results = await this.#pool.query(
      "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema LIKE 'public'"
    );
    return results.rows[0].count;
  }

  async #getDataCount() {
    let res1 = await this.#pool.query(
        "SELECT COUNT(*) AS count FROM shop_item_type"
      ),
      res2 = await this.#pool.query("SELECT COUNT(*) AS count FROM shop_item"),
      res3 = await this.#pool.query(
        "SELECT COUNT(*) AS count FROM shop_order_status_type"
      );
    return res1.rows[0].count + res2.rows[0].count + res3.rows[0].count;
  }

  async setupTablesAndData() {
    let tables = await this.#getTablesCount();
    if (tables < 1) {
      let create = fs.readFileSync(createSqlLoc).toString(enc);
      await this.#pool.query(create);
      console.log("Tables created");
    } else {
      console.log("Tables already exist, skipping creation");
    }
    let data = await this.#getDataCount();
    if (data < 1) {
      let insert = fs.readFileSync(insertSqlLoc).toString(enc);
      if (insert.length > 0) {
        await this.#pool.query(insert);
        console.log("Data inserted into tables");
      } else {
        console.log("Nothing to insert into the tables");
      }
    } else {
      console.log("Table data already exists, skipping insertion");
    }
  }
}

module.exports = { DatabasePool };
