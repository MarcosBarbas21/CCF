'use strict';

const { LoteSchema, LOTE_TABLE } = require('./../models/lote.model');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(LOTE_TABLE, LoteSchema);
  },
};
