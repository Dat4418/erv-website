// migrations/20250419_add_status_to_todos.js
exports.up = function (knex) {
  return knex.schema.hasTable("todos").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("todos", (table) => {
        table.string("status").notNullable().defaultTo("Offen");
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.hasTable("todos").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("todos", (table) => {
        table.dropColumn("status");
      });
    }
  });
};
