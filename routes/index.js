const express = require('express');

const lotesRouter = require('./lotes.router');
const usersRouter = require('./users.router');
const lotesFiltradosRouter = require('./lotesFiltrados.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router);
  router.use('/lotes', lotesRouter);
  router.use('/users', usersRouter);
  router.use('/filtrados', lotesFiltradosRouter);
}

module.exports = routerApi;
