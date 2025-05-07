const knex = require("knex");
const path = require("path");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "erv.sqlite"),
  },
  useNullAsDefault: true,
});

// Beispiel: Events-Tabelle erstellen, wenn sie noch nicht existiert
db.schema.hasTable("events").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("events", (table) => {
        table.increments("id").primary();
        table.string("title");
        table.text("description");
        table.string("date");
        table.timestamps(true, true);
      })
      .then(() => console.log('✅ Tabelle "events" erstellt.'));
  }
});

module.exports = db;

// Erstellt die User Datenbank
db.schema.hasTable("users").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("users", (table) => {
        table.increments("id").primary();
        table.string("email").unique().notNullable();
        table.string("password").notNullable(); // gehasht!
        table.string("role").defaultTo("member"); // z. B. admin, member
        table.timestamps(true, true);
      })
      .then(() => console.log('✅ Tabelle "users" erstellt.'));
  }
});

// Erstellt die Blogposts-Tabelle
db.schema.hasTable("blog_posts").then((exists) => {
  if (!exists) {
    return db.schema
      .createTable("blog_posts", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.text("content").notNullable(); // HTML von react-quill
        table.string("imageUrl");
        table.timestamp("created_at").defaultTo(db.fn.now());
      })
      .then(() => console.log('✅ Tabelle "blog_posts" erstellt.'));
  }
});
