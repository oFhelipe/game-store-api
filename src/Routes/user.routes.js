const { Router } = require('express');
const userRoutes = Router();

const userController = require('../controllers/userController')

userRoutes.post('/', userController.create);
userRoutes.post('/forgot', userController.emailToRecoverPassword);
userRoutes.put('/changePassword', userController.changePassword);

module.exports = userRoutes;