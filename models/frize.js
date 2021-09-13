// const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "frize",
    {
      frize_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        primaryKey: true,
      },
      frize_update_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fize_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      frize_cate: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      mem_id: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        references: {
          model: "member",
          key: "mem_id",
        },
      },
      frize_is_shared: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "frize",
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
        {
          name: "fk_frize_member1_idx",
          using: "BTREE",
          fields: [{ name: "mem_id" }],
        },
      ],
    }
  );
};
