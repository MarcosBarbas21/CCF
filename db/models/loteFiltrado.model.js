const { Model, DataTypes, Sequelize } = require('sequelize');

const { LOTE_TABLE } = require('./lote.model')

const LOTE_FILTRADO_TABLE = 'lotesFiltrados';

const LoteFiltradoSchema =  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'name',
  },
  coords: {
    allowNull: false,
    type: DataTypes.TEXT,
    field: 'coords',
  },
  area: {
    allowNull: false,
    type: DataTypes.FLOAT,
    field: 'area',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  loteId: {
    field: 'lote_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: LOTE_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class LoteFiltrado extends Model {

  static associate(models) {
    this.belongsTo(models.Lote, {as: 'lote'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LOTE_FILTRADO_TABLE,
      modelName: 'LoteFiltrado',
      timestamps: false
    }
  }
}

module.exports = { LoteFiltrado, LoteFiltradoSchema, LOTE_FILTRADO_TABLE };
