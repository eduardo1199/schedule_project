const express = require('express');

const HomeController = require('./src/controllers/home-controller');
const { LoginController, RegisterController, AuthenticationController, LogoutController } = require('./src/controllers/login-controller');

const route = express.Router()

route.get('/', HomeController)
route.get('/login', LoginController);
route.post('/login/register', RegisterController);
route.post('/login/authentication', AuthenticationController);
route.get('/logout', LogoutController);

module.exports = route