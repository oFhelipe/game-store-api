const { Router } = require('express');

const gameRoutes = Router();

const gameController = require('../controllers/gameController')

gameRoutes.post('/', gameController.create)

module.exports = gameRoutes;