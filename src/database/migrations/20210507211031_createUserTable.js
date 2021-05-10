
exports.up = async function(knex) {
  return await knex.schema.createTable('user', (table) => {
    table.increments('id');
    table.string('name');
    table.string('username');
    table.string('password');
    table.string('email');
    table.timestamp('birthday')
  })
};

exports.down = async function(knex) {
  return await knex.schema.dropTable('user');
};
