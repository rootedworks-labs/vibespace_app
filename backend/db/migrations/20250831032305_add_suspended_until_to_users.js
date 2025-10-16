exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    // This column will store the timestamp until which a user is suspended.
    // A NULL value means the user is not suspended.
    table.timestamp('suspended_until').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('suspended_until');
  });
};
