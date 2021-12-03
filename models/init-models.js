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
  var frize_include_ingredient = _frize_include_ingredient(
    sequelize,
    DataTypes
  );
  var frize_share = _frize_share(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var member_level = _member_level(sequelize, DataTypes);
  var member_nickname = _member_nickname(sequelize, DataTypes);

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
