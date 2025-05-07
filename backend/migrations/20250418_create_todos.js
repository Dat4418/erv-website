exports.up = function (knex) {
  return knex.schema.createTable("todos", (table) => {
    table.string("id").primary();
    table
      .string("project_id")
      .notNullable()
      .references("id")
      .inTable("projects")
      .onDelete("CASCADE");
    table.text("text").notNullable();
    table.json("members").defaultTo("[]");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("todos");
};
