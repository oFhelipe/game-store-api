const { Router } = require('express');
const userRoutes = Router();

const userController = require('../controllers/userController')

userRoutes.post('/', userController.create);

module.exports = userRoutes;