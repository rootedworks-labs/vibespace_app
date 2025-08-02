exports.up = async function(knex) {
  const hasBio = await knex.schema.hasColumn('users', 'bio');
  if (!hasBio) {
    await knex.schema.alterTable('users', function(table) {
      table.text('bio');
    });
  }

  const hasWebsite = await knex.schema.hasColumn('users', 'website');
  if (!hasWebsite) {
    await knex.schema.alterTable('users', function(table) {
      table.string('website', 255);
    });
  }
};

// Your 'down' function is likely fine, but you can update it to be safe too
exports.down = async function(knex) {
  // The 'down' function should remove the columns if they exist
  await knex.schema.alterTable('users', function(table) {
    knex.schema.hasColumn('users', 'bio').then(exists => {
      if (exists) {
        table.dropColumn('bio');
      }
    });
    knex.schema.hasColumn('users', 'website').then(exists => {
      if (exists) {
        table.dropColumn('website');
      }
    });
  });
};