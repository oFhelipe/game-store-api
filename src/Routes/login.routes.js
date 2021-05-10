const { Router } = require('express');
const loginRoutes = Router();

const loginController = require('../controllers/loginController')

loginRoutes.post('/', loginController.create);

module.exports = loginRoutes;