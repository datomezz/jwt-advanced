const { Database } = require("fakebase");
const db = new Database("./data/");
const userModel = db.table("users");
const tokenModel = db.table("tokens");

module.exports = {
  userModel,
  tokenModel
}