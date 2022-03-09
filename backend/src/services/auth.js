const crypto = require("crypto"),
  jwt = require("jwt-simple");

const { DatabasePool } = require("../database"),
  { User } = require("../database/repositories/user"),
  LocalStrategy = require("passport-local").Strategy,
  BearerStrategy = require("passport-http-bearer").Strategy;

const sec = "hg3xFntfYS6qYqdN4nLM7wkzpu98Cn48S4t1Vi2NSE1lFxKUbjtGgU9M1zTtt8T",
  alg = "sha512",
  enc = "utf-8",
  dig = "hex",
  delim = "@",
  size = 16,
  pool = new DatabasePool();

function generateRandomString() {
  return crypto.randomBytes(size).toString(dig);
}

function hashPassword(password, salt) {
  const saltedPassword = password + "," + salt;
  let hash = crypto.createHash(alg);
  hash.update(saltedPassword, enc);
  hash.copy();
  return hash.digest(dig);
}

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = new User(pool.get()),
      usr = await user.getByUsername(username);
    if (!usr) {
      done(null, false);
      return;
    }
    const pass = hashPassword(password, usr.salt),
      result = await user.auth(username, pass);
    if (result === true) {
      const newJwtHash = generateRandomString();
      await user.updateJwtHash(usr.user_id, newJwtHash);
      username += delim + newJwtHash;
      const response = jwt.encode({ username }, sec);
      done(null, response);
      console.log("Successful authentication for user: " + usr.username);
      return;
    }
  } catch (error) {
    console.log(error);
  }
  done(null, false);
  console.log("Failed authentication for user: " + username);
});

const bearerStrategy = new BearerStrategy(async (token, done) => {
  try {
    const { username } = jwt.decode(token, sec),
      split = username.split(delim),
      name = split[0],
      reqJwtHash = split[1],
      user = new User(pool.get()),
      result = await user.exists(name, true);
    if (result === true) {
      const usr = await user.getByUsername(name),
        dbJwtHash = usr.jwt_hash;
      if (reqJwtHash === dbJwtHash) {
        const response = {
          name: usr.username,
          id: usr.user_id,
        };
        done(null, response);
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
  done(null, false);
  console.log("Failed authorization for token: " + token);
});

module.exports = {
  generateRandomString,
  hashPassword,
  localStrategy,
  bearerStrategy,
};
