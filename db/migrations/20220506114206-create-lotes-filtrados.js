'use strict';

const { LoteFiltradoSchema, LOTE_FILTRADO_TABLE } = require('../models/loteFiltrado.model');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(LOTE_FILTRADO_TABLE, LoteFiltradoSchema);
  },
};
