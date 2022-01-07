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
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        references: {
          model: "member",
          key: "mem_id",
        },
        unique: "fk_frize_share_member1",
      },
      frize_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        references: {
          model: "frize",
          key: "frize_id",
        },
        unique: "fk_frize_share_frize1",
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
        {
          name: "frish_id_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "frish_id" }],
        },
      ],
    }
  );
};
