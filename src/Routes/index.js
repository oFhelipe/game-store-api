const { Router } = require('express');

const userRoutes = require('./user.routes')
const loginRoutes = require('./login.routes')
const gameRoutes = require('./game.routes')

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/login', loginRoutes);
routes.use('/game', gameRoutes);

module.exports = routes;