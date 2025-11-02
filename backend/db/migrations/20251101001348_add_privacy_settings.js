// This migration adds privacy settings to the 'users' table
// and a 'status' column to the 'follows' table,
// as specified in the Functional Spec.

exports.up = async function(knex) {
  // 1. Add columns to 'users' table (Spec 4.1)
  await knex.schema.alterTable('users', (table) => {
    table
      .string('account_privacy', 50) // e.g., 'public', 'private'
      .notNullable()
      .defaultTo('public');
    
    table
      .string('dm_privacy', 50) // e.g., 'open', 'mutuals'
      .notNullable()
      .defaultTo('open');
  });

  // 2. Add 'status' column to 'follows' table (Spec 4.2)
  await knex.schema.alterTable('follows', (table) => {
    table
      .string('status', 50) // e.g., 'approved', 'pending'
      .notNullable()
      .defaultTo('approved');
  });
};

exports.down = async function(knex) {
  // Rollback in reverse order

  // 1. Remove 'status' from 'follows'
  await knex.schema.alterTable('follows', (table) => {
    table.dropColumn('status');
  });

  // 2. Remove columns from 'users'
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('account_privacy');
    table.dropColumn('dm_privacy');
  });
};
