exports.up = function(knex) {
  return knex.schema.createTable('follows', (table) => {
    // 'follower_id' is the user who is doing the following
    table.integer('follower_id').unsigned().notNullable();
    table.foreign('follower_id').references('id').inTable('users').onDelete('CASCADE');

    // 'followee_id' is the user who is being followed
    table.integer('followee_id').unsigned().notNullable();
    table.foreign('followee_id').references('id').inTable('users').onDelete('CASCADE');

    // The primary key is the combination of both IDs to prevent duplicate follow entries
    table.primary(['follower_id', 'followee_id']);

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('follows');
};