var DataTypes = require("sequelize").DataTypes;
var _auth_tmp = require("./auth_tmp");
var _foot_ingredient = require("./foot_ingredient");
var _frize = require("./frize");
var _frize_include_ingredient = require("./frize_include_ingredient");
var _frize_share = require("./frize_share");
var _member = require("./member");
var _member_level = require("./member_level");
var _member_nickname = require("./member_nickname");

function initModels(sequelize) {
  var auth_tmp = _auth_tmp(sequelize, DataTypes);
  var foot_ingredient = _foot_ingredient(sequelize, DataTypes);
  var frize = _frize(sequelize, DataTypes);
  var frize_include_ingredient = _frize_include_ingredient(sequelize, DataTypes);
  var frize_share = _frize_share(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var member_level = _member_level(sequelize, DataTypes);
  var member_nickname = _member_nickname(sequelize, DataTypes);

  frize_include_ingredient.belongsTo(frize, { as: "frize", foreignKey: "frize_id"});
  frize.hasOne(frize_include_ingredient, { as: "frize_include_ingredient", foreignKey: "frize_id"});
  frize_share.belongsTo(frize, { as: "frize", foreignKey: "frize_id"});
  frize.hasOne(frize_share, { as: "frize_share", foreignKey: "frize_id"});
  auth_tmp.belongsTo(member, { as: "mem", foreignKey: "mem_id"});
  member.hasOne(auth_tmp, { as: "auth_tmp", foreignKey: "mem_id"});
  frize.belongsTo(member, { as: "mem", foreignKey: "mem_id"});
  member.hasMany(frize, { as: "frizes", foreignKey: "mem_id"});
  frize_share.belongsTo(member, { as: "mem", foreignKey: "mem_id"});
  member.hasOne(frize_share, { as: "frize_share", foreignKey: "mem_id"});
  member_level.belongsTo(member, { as: "mem", foreignKey: "mem_id"});
  member.hasOne(member_level, { as: "member_level", foreignKey: "mem_id"});
  member_nickname.belongsTo(member, { as: "mem", foreignKey: "mem_id"});
  member.hasOne(member_nickname, { as: "member_nickname", foreignKey: "mem_id"});

  return {
    auth_tmp,
    foot_ingredient,
    frize,
    frize_include_ingredient,
    frize_share,
    member,
    member_level,
    member_nickname,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
