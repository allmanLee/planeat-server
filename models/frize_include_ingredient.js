const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "frize_include_ingredient",
    {
      frize_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "frize",
          key: "frize_id",
        },
      },
      frinclude_ingredient: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "frize_include_ingredient",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "frize_id" }],
        },
        {
          name: "frize_id_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "frize_id" }],
        },
      ],
    }
  );
};
