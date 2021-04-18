const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');
const usersController = new UsersController();

const TransactionsController = require('./controllers/TransactionsController');
const transactionsController = new TransactionsController();

routes.get('/users/search', usersController.search);
routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);
routes.post('/users', usersController.create);
routes.delete('/users/:id', usersController.delete);
routes.put('/users/:id', usersController.update);

routes.post('/transfers', transactionsController.create);
routes.get('/transfers', transactionsController.index);
routes.delete('/transfers/:id', transactionsController.delete);


module.exports = routes;
