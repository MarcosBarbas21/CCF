const boom = require('@hapi/boom');
const parseKMZ = require("parse2-kmz");
const { models } = require('./../libs/sequelize');

class LoteService {

  constructor() {}

  async create(data) {
    const newLote = await models.Lote.create(data);
    return newLote;
  }

  async find() {
    const rta = await models.Lote.findAll();
    return rta;
  }

  async findOne(id) {
    const lote = await models.Lote.findByPk(id);
    if (!lote) {
      throw boom.notFound('Lote not found');
    }
    return lote;
  }

  async update(id, changes) {
    const lote = await this.findOne(id);
    const rta = await lote.update(changes);
    return rta;
  }

  async parse2(changes) {
    let rta = parseKMZ.toJson(changes);
    //const rta = await lote.update(changes);
    return rta;
  }

  async delete(id) {
    const lote = await this.findOne(id);
    await lote.destroy();
    return { id };
  }

}

module.exports = LoteService;
