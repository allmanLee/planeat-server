const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "member",
    {
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
      },
      mem_email: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      mem_pw: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mem_pw_salt: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      mem_email_auth: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      mem_denied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      mem_register_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      mem_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      mem_phone: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      mem_sex: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      mem_ref_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mem_recent_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mem_sns: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: "email",
      },
    },
    {
      sequelize,
      tableName: "member",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mem_id" }],
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
