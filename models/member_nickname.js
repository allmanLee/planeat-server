const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "member_nickname",
    {
      mni_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
      },
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: "mem_id_UNIQUE",
      },
      mni_nickname: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: "mni_nickname_UNIQUE",
      },
      mni_update_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "member_nickname",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mni_id" }],
        },
        {
          name: "mni_id_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mni_id" }],
        },
        {
          name: "mem_id_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mem_id" }],
        },
        {
          name: "mni_nickname_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mni_nickname" }],
        },
      ],
    }
  );
};
