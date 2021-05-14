
exports.up = async function(knex) {
  return await knex.schema.createTable('game',(table) => {
    table.increments();
    table.string('name');
    table.string('background');
    table.string('character'); //personagem
    table.string('cover'); //capa
    table.string('developer');  //desenvolvedora
    table.string('destributor'); //destribuidora
    table.text('description');
    table.float('price');
    table.string('platform');
    table.float('discount',[3],[2]); // 0 até 1
    table.string('gender');
    table.integer('size');
    table.string('multiplayer');
    table.timestamp('release'); //data de lançamento
    table.text('multimedia');
  });
};

exports.down = async function(knex) {
  return await knex.schema.dropTable('game');
};
