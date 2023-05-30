'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Komentar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Komentar.belongsTo(models.User, { foreignKey: "userId" });
      Komentar.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  Komentar.init({
    isi: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Komentar',
  });
  return Komentar;
};