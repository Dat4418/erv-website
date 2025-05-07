// backend/migrations/20250417_add_category_to_blog_posts.js
exports.up = function (knex) {
  return knex.schema.hasTable("blog_posts").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("blog_posts", (table) => {
        table.string("category").defaultTo("Verein");
      });
    } else {
      return knex.schema.createTable("blog_posts", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.text("content").notNullable();
        table.string("imageUrl");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.string("category").defaultTo("Verein");
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.hasTable("blog_posts").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("blog_posts", (table) => {
        table.dropColumn("category");
      });
    }
  });
};
