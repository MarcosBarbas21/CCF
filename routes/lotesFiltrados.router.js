const express = require('express');

const LoteFiltradoService = require('../services/loteFiltrado.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createLoteFiltradoSchema, updateLoteFiltradoSchema, getLoteFiltradoSchema } = require('../schemas/lotesFiltrados.schema');

const router = express.Router();
const service = new LoteFiltradoService();

router.get('/', async (req, res, next) => {
  try {
    const lotesFiltrados = await service.find();
    res.json(lotesFiltrados);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getLoteFiltradoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const loteFiltrado = await service.findOne(id);
      res.json(loteFiltrado);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createLoteFiltradoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newLoteFiltrado = await service.create(body);
      res.status(201).json(newLoteFiltrado);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getLoteFiltradoSchema, 'params'),
  validatorHandler(updateLoteFiltradoSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const loteFiltrado = await service.update(id, body);
      res.json(loteFiltrado);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getLoteFiltradoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
