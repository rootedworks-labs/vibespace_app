exports.up = function(knex) {
  return knex.schema.alterTable('posts', (table) => {
    // Add the new column for the vibe channel tag.
    // It's a string, can be null, and we'll add an index for faster filtering.
    table.string('vibe_channel_tag').nullable();
    table.index('vibe_channel_tag');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('posts', (table) => {
    // To roll back, we simply drop the column.
    table.dropColumn('vibe_channel_tag');
  });
};
