const { User, UserSchema } = require('./user.model');
const { Lote, LoteSchema } = require('./lote.model');
const { LoteFiltrado, LoteFiltradoSchema } = require('./loteFiltrado.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Lote.init(LoteSchema, Lote.config(sequelize));
  LoteFiltrado.init(LoteFiltradoSchema, LoteFiltrado.config(sequelize));

  User.associate(sequelize.models);
  Lote.associate(sequelize.models);
  LoteFiltrado.associate(sequelize.models);
}

module.exports = setupModels;
