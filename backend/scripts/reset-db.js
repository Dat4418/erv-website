// scripts/reset-db.js
require("dotenv").config();
const mongoose = require("mongoose");
const { DB_URI } = process.env;

async function reset() {
  await mongoose.connect(DB_URI);
  await mongoose.connection.dropDatabase();
  console.log("🗑️ Datenbank geleert");
  await mongoose.disconnect();
}
reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
