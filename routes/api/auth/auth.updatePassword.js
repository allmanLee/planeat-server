const models = require("../../../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //비밀번호 암호화
require("dotenv").config();

//비밀번호 변경 SQL 컨트롤러 (UPDATE)
const updatePassword = async function (req, res) {
  try {
    let inputPassword = await req.body.password;
    let auth_key = req.body.key;

    var salt = Math.round(new Date().valueOf() * Math.random()) + "";
    var hashPassword = crypto
      .createHash("sha512")
      .update(inputPassword + salt)
      .digest("hex");

    let searchAuth = await models.auth
      .findOne({ where: { auth_key: auth_key } })
      .catch(() => {
        return Promise.reject({
          status: 500,
          success: false,
          data: {
            name: "ERR-DATABASE ERR",
            message: "DATABASE ERR",
          },
        });
      });
    if (searchAuth == null) {
      return await Promise.reject({
        status: 409,
        success: false,
        data: {
          name: "Invalid Key Value",
          message: "올바르지 않는 키값입니다.",
        },
      });
    }
    await models.user.update(
      { pwd: hashPassword, salt: salt },
      { where: { guid: searchAuth.dataValues.user_uid } }
    );
    var createToken = await function () {
      const token = jwt.sign(
        { username: req.body.email },
        process.env.JWTSECRET_KEY,
        {
          algorithm: "HS256",
          expiresIn: "1m",
        }
      );
      const refresh_token = jwt.sign(
        { username: req.body.email },
        process.env.REF_JWTSECRET_KEY,
        {
          algorithm: "HS256",
          expiresIn: "30d",
        }
      );

      return { token: token, refresh_token: refresh_token };
    };
    await models.auth.destroy({ where: { auth_key: auth_key } });
    res.status(200).json({
      success: true,
      code: 200,
      message: "successed login",
      returnObj: createToken(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports = { updatePassword };
