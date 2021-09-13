/* eslint-disable no-unused-vars */
const models = require("../../../models");
const crypto = require("crypto"); //비밀번호 암호화
const { v4 } = require("uuid");
require("dotenv").config();

//회원가입 SQL 컨트롤러
async function MemberRegister(req, res) {
  try {
    const authKey = req.body.key;
    const inputPassword = req.body.password;
    const inputEmail = req.body.email;
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";
    const hashPassword = crypto
      .createHash("sha512")
      .update(inputPassword + salt)
      .digest("hex");

    const memberObj = {
      mem_id: v4().replace(/-/gi, ""),
      mem_email: inputEmail,
      mem_pw: hashPassword,
      mem_pw_salt: salt,
      mem_email_auth: true,
      mem_denied: false,
      mem_register_date: new Date(),
    };
    const searchEmailOfAuth = await models.auth_tmp
      .findOne({
        where: { auth_email: inputEmail },
      })
      .then(async (data) => {
        if (data == null) {
          return Promise.reject({
            status: 409,
            data: {
              errorCode: "BudUnauthorizedExeption",
              message:
                "can't find the email on auth table, 이메일 인증 요청을 보내지 않았습니다.",
            },
          });
        } else {
          const searchAuth = await models.auth_tmp.findOne({
            where: { auth_token: authKey },
          });

          if (searchAuth == null) {
            return await Promise.reject({
              status: 409,
              data: {
                errorCode: "BudUnauthorizedExeption",
                message: "bad auth key, 잘못된 이메일 인증키 입니다",
              },
            });
          }

          await models.member.create(memberObj).catch((err) => {
            return Promise.reject({
              status: 409,
              data: err,
            });
          });
          await models.auth_tmp.destroy({ where: { auth_token: authKey } });

          res.status(200).json({
            success: true,
            message: "successed register",
            returnObj: {},
          });
        }
      })
      .catch();
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      errdata: err,
      // errorCode: err.data.errorCode || err.data.code,
      //message: err.data.message,
    });
  }
}

//이메일 중복 확인
async function MemberCheckEmail(req, res) {
  try {
    const inputEmail = req.query.email;
    const result = await models.member
      .findOne({
        where: {
          mem_email: inputEmail,
        },
      })
      .catch((err) => {
        return Promise.reject({
          status: 403,
          success: false,
          data: err,
        });
      });
    if (result == null) {
      res.status(200).json({
        success: true,
        message: "unexist",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "exist",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      code: err.status || 500,
      status: err.data.name,
      message: err.data.message,
    });
  }
}

//토큰키 확인
const TokenCheck = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};

module.exports = { MemberRegister, MemberCheckEmail, TokenCheck };
