const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class LoteFiltradoService {

  constructor() {}

  async create(data) {
    const newLoteFiltrado = await models.LoteFiltrado.create(data);
    return newLoteFiltrado;
  }

  async find() {
    const rta = await models.LoteFiltrado.findAll();
    return rta;
  }

  async findOne(id) {
    const loteFiltrado = await models.LoteFiltrado.findByPk(id);
    if (!loteFiltrado) {
      throw boom.notFound('Lote filtrado not found');
    }
    return loteFiltrado;
  }

  async update(id, changes) {
    const loteFiltrado = await this.findOne(id);
    const rta = await loteFiltrado.update(changes);
    return rta;
  }

  async delete(id) {
    const loteFiltrado = await this.findOne(id);
    await loteFiltrado.destroy();
    return { id };
  }

}

module.exports = LoteFiltradoService;
