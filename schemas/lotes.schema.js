const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const coords = Joi.any()
const area = Joi.number()
const userId = Joi.number().integer();

const createLoteSchema = Joi.object({
  name: name.required(),
  coords: coords.required(),
  area: area.required(),
  userId: userId.required(),
});

const updateLoteSchema = Joi.object({
  name: name,
  coords: coords,
  area: area
});

const getLoteSchema = Joi.object({
  id: id.required(),
});

const getParsedKMZ = Joi.object({
  coords: coords.required(),
});

module.exports = { createLoteSchema, updateLoteSchema, getLoteSchema, getParsedKMZ }
