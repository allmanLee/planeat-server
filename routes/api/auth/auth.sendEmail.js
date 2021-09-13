const models = require("../../../models");
const crypto = require("crypto"); //비밀번호 암호화
const nodemailer = require("nodemailer");
require("dotenv").config();

//토큰키 생성
const createToken = () => crypto.randomBytes(20).toString("hex");

//이메일로 사용자 식별아이디 검색
const searchedIdByQuery = async (req) => {
  let result = await models.member.findOne({
    where: {
      mem_email: req.body.email,
    },
  });
  const userId = await result.dataValues.guid;
  console.log(userId);
  return userId;
};

//이메일 인증 인증키 전송_이메일 보내기 API
const SendAuthEmail = async function (req, res) {
  try {
    const token = createToken();
    const emailOption = {
      from: "LAFTEL Team <leeyoujun61@gmail.com>",
      to: "muenzz119@naver.com",
      subject: "안녕하세요 Laftel 고객님. 인증키를 발급받았습니다.",
      html: `고객님의 인증키는 ${token}입니다.`,
    };

    const dataObj = {
      auth_token: token,
      auth_email: req.body.email,
      auth_id: "a",
    };

    await models.auth_tmp
      .create(dataObj)
      .then(function () {
        console.log("삽입완료");
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          models.auth_email
            .update(
              { auth_code: token },
              { where: { auth_email: dataObj.auth_email } }
            )
            .then(function () {
              console.log("변경완료");
            });
        } else {
          return Promise.reject({
            status: 409,
            success: false,
            data: {
              name: err.name,
              message: err.message,
            },
          });
        }
      });

    let transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    let info = await transporter.sendMail(emailOption).catch((err) => {
      console.log(err);
      return Promise.reject({
        status: 409,
        success: false,
        data: {
          name: "ERR",
          message: "이메일을 전송하지 못했습니다.",
        },
      });
    });

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Sent Auth Email",
      messageId: info.messageId,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({
      success: false,
      code: err.status || 500,
      status: err.data.name || "ERR",
      message: err.data.message,
    });
  }
};

//비밀번호 변경 이메일 전송 -> 이베일 전송 API (보류)
const SendChangePasswordEmail = async function (req, res) {
  try {
    const token = createToken;
    const userId = searchedIdByQuery(req);

    if (userId != null) {
      const data = {
        auth_token: token,
        mem_id: userId,
      };

      await models.auth.create(data).catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          return Promise.reject({
            status: 409,
            success: false,
            data: {
              name: err.name,
              message: "이미 전송하였습니다.",
            },
          });
        } else {
          return Promise.reject({
            status: 409,
            success: false,
            data: {
              name: err.name,
              message: err.message,
            },
          });
        }
      });
    } else {
      return await Promise.reject({
        status: 409,
        success: false,
        data: {
          name: "Email does not exist",
          message: "해당 이메일이 존재하지 않습니다.",
        },
      });
    }

    let transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    let info = await transporter
      .sendMail({
        from: "LAFTEL Team <leeyoujun61@gmail.com>",
        to: "muenzz119@naver.com",
        subject: "안녕하세요 Laftel 고객님. 비밀번호를 변경해주세요.",
        html: `<a href="http://localhost:3000/reset/?key=${token}">비밀번호 변경 바로가기</a>`,
      })
      .catch(() => {
        return Promise.reject({
          status: 409,
          success: false,
          data: {
            name: "ERR",
            message: "이메일을 전송하지 못했습니다.",
          },
        });
      });

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Sent Auth Email",
      messageId: info.messageId,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({
      success: false,
      code: err.status || 500,
      status: err.data.name || "ERR",
      message: err.data.message,
    });
  }
};

module.exports = {
  SendAuthEmail,
  SendChangePasswordEmail,
};

//------------------------------------
//UPDATE 사용 예제
// models.User.update(
//   { password: "새로운 유저PW" },
//   { where: { userID: "유저ID" } }
// )
//   .then((result) => {
//     res.json(result);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
