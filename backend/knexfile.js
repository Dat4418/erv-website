// backend/knexfile.js
const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "db", "erv.sqlite"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "migrations"),
    },
  },
};
