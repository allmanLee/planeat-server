/* eslint-disable no-unused-vars */
const models = require("../../../models");
const crypto = require("crypto"); //비밀번호 암호화
const { v4 } = require("uuid");
require("dotenv").config();

//이메일로 아이디를 검색해서 멤버의 아이디를 리턴한다.
async function searchedId(email) {
  let id = await models.member
    .findOne({
      attributes: ["mem_id"],
      where: { mem_email: email },
    })
    .then((data) => data.mem_id)
    .catch((err) => Promise.reject(err));
  return id;
}

//회원가입 SQL 컨트롤러
async function MemberRegister(req, res) {
  try {
    const inputPassword = req.body.password;
    const inputEmail = req.body.email;
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";
    const hashPassword = crypto
      .createHash("sha512")
      .update(inputPassword + salt)
      .digest("base64");

    const memberObj = {
      mem_id: v4().replace(/-/gi, ""),
      mem_email: inputEmail,
      mem_pw: hashPassword,
      mem_pw_salt: salt,
      mem_email_auth: false,
      mem_denied: false,
      mem_register_date: new Date(),
    };
    await models.member
      .create(memberObj)
      .then(() =>
        res.status(200).json({
          success: true,
          message: `add ${inputEmail} in member table`,
        })
      )
      .catch((err) => {
        return Promise.reject({
          status: 409,
          data: err,
        });
      });
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
        attributes: ["mem_sns"],
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
      if (result.mem_sns === "email") {
        res.status(403).json({
          success: false,
          message: "exist, this email have been registerd to email user",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "exist, but not have been registered with email",
        });
      }
    }
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      code: err.status || 500,
      status: err.data.name || err.name,
      message: err.data.message || err.message,
    });
  }
}

//회원가입을 위한 인증키 확인
//확인시 auth_tmp에서 인증코드 삭제 , member 테이블에서 mem_email_auth true 로 변경
const MemberCheckAuthKey = async function MemberCheckAuthKey(req, res) {
  const email = req.body.email;
  const authkey = req.body.key;
  const id = await searchedId(email);
  return await models.auth_tmp
    .findOne({
      where: { mem_id: id, auth_token: authkey },
    })
    .then((data) => {
      if (data === null) {
        return res
          .status(409)
          .json({ success: false, message: "올바른 데이터를 찾을 수 없음" });
      }
      res.status(200).json({ success: true, message: "인증코드 정상 확인" });
      models.auth_tmp.destroy({ where: { auth_token: authkey } });
      models.member.update(
        { mem_email_auth: true },
        { where: { mem_email: email } }
      );
    })
    .catch((err) => console.log(err));
};

//토큰키 확인
const TokenCheck = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};

module.exports = {
  MemberRegister,
  MemberCheckEmail,
  MemberCheckAuthKey,
  TokenCheck,
};

// const searchEmailOfAuth = await models.auth_tmp
//   .findOne({
//     where: { auth_email: inputEmail },
//   })
//   .then(async (data) => {
//     if (data == null) {
//       return Promise.reject({
//         status: 409,
//         data: {
//           errorCode: "BudUnauthorizedExeption",
//           message:
//             "can't find the email on auth table, 이메일 인증 요청을 보내지 않았습니다.",
//         },
//       });
//     } else {
// const searchAuth = await models.auth_tmp.findOne({
//   where: { auth_token: authKey },
// });

// if (searchAuth == null) {
//   return await Promise.reject({
//     status: 409,
//     data: {
//       errorCode: "BudUnauthorizedExeption",
//       message: "bad auth key, 잘못된 이메일 인증키 입니다",
//     },
//   });
// }

//     await models.auth_tmp.destroy({ where: { auth_token: authKey } });

//     res.status(200).json({
//       success: true,
//       message: "successed register",
//       returnObj: {},
//     });
//   }
// })
// .catch();
