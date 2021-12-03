const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "frize_share",
    {
      frish_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
      },
      frize_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: "frize_id_UNIQUE",
      },
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: "mem_id_UNIQUE",
      },
    },
    {
      sequelize,
      tableName: "frize_share",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "frish_id" }],
        },
        {
          name: "frize_id_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "frize_id" }],
        },
        {
          name: "mem_id_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mem_id" }],
        },
      ],
    }
  );
};
