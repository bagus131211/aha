"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Verification.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Verification.init(
    {
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Verification",
    }
  );
  return Verification;
};
