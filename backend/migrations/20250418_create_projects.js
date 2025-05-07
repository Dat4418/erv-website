exports.up = function (knex) {
  return knex.schema.createTable("projects", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("projects");
};
