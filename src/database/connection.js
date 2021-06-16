const knex = require('knex');

const knexfile = require('../../knexfile')

const env = process.env.ENV

const con = knex(env === 'production' ? knexfile.production : knexfile.development);

module.exports = con;