exports.up = async function(knex) {
  await knex.schema.alterTable('posts', (table) => {
    table.jsonb('link_preview_data');
  });
  await knex.schema.alterTable('comments', (table) => {
    table.jsonb('link_preview_data');
  });
  await knex.schema.alterTable('messages', (table) => {
    table.jsonb('link_preview_data');
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('posts', (table) => {
    table.dropColumn('link_preview_data');
  });
  await knex.schema.alterTable('comments', (table) => {
    table.dropColumn('link_preview_data');
  });
  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('link_preview_data');
  });
};