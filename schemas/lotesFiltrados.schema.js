const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(50);
const coords = Joi.any()
const area = Joi.number()
const loteId = Joi.number().integer();

const createLoteFiltradoSchema = Joi.object({
  name: name.required(),
  coords: coords.required(),
  area: area.required(),
  loteId: loteId.required(),
});

const updateLoteFiltradoSchema = Joi.object({
  name: name,
  coords: coords,
  area: area
});

const getLoteFiltradoSchema = Joi.object({
  id: id.required(),
});

module.exports = { createLoteFiltradoSchema, updateLoteFiltradoSchema, getLoteFiltradoSchema }
