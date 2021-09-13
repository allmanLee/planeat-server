const models = require("../../../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //비밀번호 암호화
require("dotenv").config();

//로그인 SQL 컨트롤러
const login = async function (req, res) {
  try {
    const result = await models.user
      .findOne({
        where: {
          email: req.body.email,
        },
      })
      .catch((err) => {
        return Promise.reject({
          status: 403,
          success: false,
          data: err,
        });
      });

    await new Promise((resolve, reject) => {
      if (result != null) {
        const dbPassword = result.dataValues.pwd;
        const inputPassword = req.body.password;
        const salt = result.dataValues.salt;
        const hashPassword = crypto
          .createHash("sha512")
          .update(inputPassword + salt)
          .digest("hex");
        if (dbPassword === hashPassword) {
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
          return res.status(200).json({
            success: true,
            code: 200,
            message: "successed login",
            returnObj: { token: token, refresh_token: refresh_token },
          });
        } else {
          //res.redirect("/user/login");
          return reject({
            status: 409,
            success: false,
            data: {
              name: "Incorrect password",
              message: "비밀번호 불일치",
            },
          });
        }
      } else {
        return reject({
          status: 409,
          success: false,
          data: {
            name: "Email does not exist",
            message: "해당 이메일이 존재하지 않습니다.",
          },
        });
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      code: err.status || 500,
      status: err.data.name,
      message: err.data.message,
    });
  }
};

exports = { login };
