
exports.up = function(knex, Promise) {
 return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('value', 100);
    table.boolean('packed');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('items')
};
