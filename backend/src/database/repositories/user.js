class User {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async auth(name, pass) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_user WHERE username = $1 AND password = $2",
      [name, pass]
    );
    return result.rowCount === 1;
  }

  async register(user) {
    if (!user) return;

    let result = await this.#pool.query(
      "INSERT INTO shop_user (username, password, salt, name, surname, email, complete_address, jwt_hash, activation_code) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        user.username,
        user.password,
        user.salt,
        user.name,
        user.surname,
        user.email,
        user.completeAddress,
        user.jwtHash,
        user.activationCode,
      ]
    );
    return result.rows[0];
  }

  async exists(str, isName) {
    let result = await this.#pool.query(
      isName === true
        ? "SELECT * FROM shop_user WHERE username = $1"
        : "SELECT * FROM shop_user WHERE email = $1",
      [str]
    );
    return result.rowCount === 1;
  }

  async codeExists(code) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_user WHERE activation_code = $1",
      [code]
    );
    return result.rowCount > 0;
  }

  async getById(id) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_user WHERE user_id = $1",
      [id]
    );
    return result.rows[0];
  }

  async getByUsername(name) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_user WHERE username = $1",
      [name]
    );
    return result.rows[0];
  }

  async getByEmail(email) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_user WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  async getByCode(code) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_user WHERE activation_code = $1",
      [code]
    );
    return result.rows[0];
  }

  async updateJwtHash(id, hash) {
    await this.#pool.query(
      "UPDATE shop_user SET jwt_hash = $1 WHERE user_id = $2",
      [hash, id]
    );
  }

  async getActivationCode(id) {
    let result = await this.#pool.query(
      "SELECT activation_code FROM shop_user WHERE user_id = $1",
      [id]
    );
    return result.rows[0].activation_code;
  }

  async activateAccount(id) {
    await this.#pool.query(
      "UPDATE shop_user SET activation_code = 1 WHERE user_id = $1",
      [id]
    );
  }

  async updateActivationCode(id, activationCode) {
    await this.#pool.query(
      "UPDATE shop_user SET activation_code = $1 WHERE user_id = $2",
      [activationCode, id]
    );
  }

  async updatePasswordByCode(code, password) {
    await this.#pool.query(
      "UPDATE shop_user SET password = $1 WHERE activation_code = $2",
      [password, code]
    );
  }

  async updateEmailAndCompleteAddressById(id, email, completeAddress) {
    await this.#pool.query(
      "UPDATE shop_user SET email = $1, complete_address = $2 WHERE user_id = $3",
      [email.toString(), completeAddress.toString(), parseInt(id)]
    );
  }
}

module.exports = { User };
