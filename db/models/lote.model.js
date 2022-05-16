const { Model, DataTypes, Sequelize } = require('sequelize');

const { USER_TABLE } = require('./user.model')

const LOTE_TABLE = 'lotes';

const LoteSchema =  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
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
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: false,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Lote extends Model {

  static associate(models) {
    this.belongsTo(models.User, {as: 'user'});
    this.hasMany(models.LoteFiltrado, {
      as: 'lotesFiltrados',
      foreignKey: 'loteId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LOTE_TABLE,
      modelName: 'Lote',
      timestamps: false
    }
  }
}

module.exports = { Lote, LoteSchema, LOTE_TABLE };
