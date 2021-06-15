const { Router } = require('express');

const gameRoutes = Router();

const gameController = require('../controllers/gameController')

gameRoutes.post('/', gameController.create)
gameRoutes.get('/', gameController.getGames)
gameRoutes.get('/lancamentos', gameController.getLancamentos)
gameRoutes.get('/:gameId', gameController.index)
gameRoutes.post('/order', gameController.confirmOrder)

module.exports = gameRoutes;