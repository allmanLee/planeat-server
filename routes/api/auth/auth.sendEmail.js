const models = require("../../../models");
const crypto = require("crypto"); //비밀번호 암호화
const nodemailer = require("nodemailer");
require("dotenv").config();

//토큰키 생성
const createToken = () => crypto.randomBytes(20).toString("hex");

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

//이메일 인증 인증키 전송_이메일 보내기 API
const SendAuthEmail = async function (req, res) {
  try {
    const email = req.body.email;
    const id = await searchedId(email);
    const token = createToken().substring(0, 8);
    const emailOption = {
      from: "PLANEAT Team <leeyoujun61@gmail.com>",
      to: email,
      subject:
        "안녕하세요 PlANEAT(냉장고 파먹는 레시피) 이용자님. 인증키를 발급받았습니다.",
      html: `고객님의 인증키는 ${token}입니다.`,
    };

    const dataObj = {
      mem_id: id,
      auth_token: token,
    };

    await models.auth_tmp
      .create(dataObj)
      .then(function () {
        console.log("삽입완료");
        const randomToken = createToken().substring(0, 8);
        //120초(2분)후에 임의의 토큰값으로 제변경
        setTimeout(() => {
          models.auth_tmp
            .update({ auth_token: randomToken }, { where: { mem_id: id } })
            .then(function () {
              console.log("변경완료");
            });
        }, 120000);
      })
      .catch((err) => {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          models.auth_tmp
            .update({ auth_token: token }, { where: { mem_id: id } })
            .then(function () {
              console.log("변경완료");
              const randomToken = createToken().substring(0, 8);
              //120초(2분)후에 임의의 토큰값으로 제변경
              setTimeout(() => {
                models.auth_tmp
                  .update(
                    { auth_token: randomToken },
                    { where: { mem_id: id } }
                  )
                  .then(function () {
                    console.log("변경완료");
                  });
              }, 120000);
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
    const userId = searchedId(req);

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
        from: "PLANEAT Team <leeyoujun61@gmail.com>",
        to: "muenzz119@naver.com",
        subject:
          "안녕하세요 PlANEAT(냉장고 파먹는 레시피) 이용자님. 비밀번호를 변경해주세요.",
        html: `<a href="http://localhost:3000/reset/?key=${token}">비밀번호 변경 바로가기</a>`,
      })
      .catch((err) => {
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
