const express = require('express');

const LoteService = require('../services/lote.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createLoteSchema, updateLoteSchema, getLoteSchema, getParsedKMZ } = require('../schemas/lotes.schema');

const router = express.Router();
const service = new LoteService();

router.get('/', async (req, res, next) => {
  try {
    const lotes = await service.find();
    res.json(lotes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getLoteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const lote = await service.findOne(id);
      res.json(lote);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createLoteSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newLote = await service.create(body);
      res.status(201).json(newLote);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getLoteSchema, 'params'),
  validatorHandler(updateLoteSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const lote = await service.update(id, body);
      res.json(lote);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/parse2',
  validatorHandler(getParsedKMZ, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newParsed = await service.parse2(body);
      res.status(201).json(newParsed);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getLoteSchema, 'params'),
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
