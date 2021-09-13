const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('foot_ingredient', {
    ingre_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ingre_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ingre_eng: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "ingre_eng_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'foot_ingredient',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ingre_no" },
        ]
      },
      {
        name: "ingre_eng_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ingre_eng" },
        ]
      },
      {
        name: "ingre_no_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ingre_no" },
        ]
      },
    ]
  });
};
