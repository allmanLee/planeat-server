const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "auth_tmp",
    {
      auth_token: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: "auth_token_UNIQUE",
      },
      auth_email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        primaryKey: true,
        unique: "auth_email_UNIQUE",
      },
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: true,
        references: {
          model: "member",
          key: "mem_id",
        },
        unique: "fk_auth_tmp_member",
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
          fields: [{ name: "auth_email" }],
        },
        {
          name: "auth_token_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "auth_token" }],
        },
        {
          name: "auth_email_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "auth_email" }],
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
