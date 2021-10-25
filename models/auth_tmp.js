const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "auth_tmp",
    {
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: "mem_id_UNIQUE",
      },
      auth_token: {
        type: DataTypes.STRING(45),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: "auth_tmp",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "auth_token" }],
        },
        {
          name: "auth_token_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "auth_token" }],
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
