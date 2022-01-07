const models = require("../../../models");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//이메일 중복 확인
async function searchedIdWithSNS(email, sns) {
  let id = await models.member
    .findOne({
      attributes: ["mem_id"],
      where: { mem_email: email, mem_sns: sns },
    })
    .then((data) => data)
    .catch((err) => err);
  return id;
}

//SNS 로그인 컨트롤러
const ControllerToSNS = async function (req, res) {
  try {
    const sns_type = req.body.snsType;
    const email = req.body.email;
    //member Obj
    const beUpdatedMem = {
      mem_id: v4().replace(/-/gi, ""),
      mem_email: email,
      mem_email_auth: true,
      mem_denied: false,
      mem_sns: sns_type,
      mem_register_date: new Date(),
    };
    const acToken = jwt.sign(
      { mem_email: req.body.email },
      process.env.JWTSECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "20m",
      }
    );
    const refToken = jwt.sign(
      { mem_email: req.body.email },
      process.env.REF_JWTSECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "30d",
      }
    );

    //DB 컨트롤 성공시
    const success = (data) => {
      return res.status(200).json({
        success: true,
        message: `success to create or update to DB`,
        dataObj: data,
      });
    };

    //DB 컨트롤 실패시
    const error = (err) => {
      return Promise.reject({
        status: 500,
        message: err.message,
      });
    };

    //로그인
    const LoginToSNS = (email) => {
      return models.member
        .update(
          { mem_ref_token: refToken, mem_recent_token: acToken },
          { where: { mem_email: email } }
        )
        .then()
        .catch(error);
    };

    //회원가입
    const RegisterToSNS = (object) => {
      return models.member
        .create(object)
        .then()
        .catch((err) => error(err));
    };

    await searchedIdWithSNS(email, sns_type)
      .then(async (data) => {
        console.log(data);
        if (data === null) {
          await RegisterToSNS(beUpdatedMem);
        }
        await LoginToSNS(email);
        success({ method: "register", acToken, refToken });
      })
      .catch(async (err) => {
        Promise.reject(err);
      });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      code: err.status || 500,
      message: err.message,
    });
  }
};

module.exports = { ControllerToSNS };
