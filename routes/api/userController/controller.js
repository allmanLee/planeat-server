"use strict";
const models = require("../../../models");

//회원탈퇴 SQL 컨트롤러
async function deleteMember(req, res) {
  try {
    const email = req.decoded.mem_email;
    await models.member
      .destroy({
        where: { mem_email: email },
      })
      .then(() => {
        res.status(200).json({
          success: true,
          message: "회원 탈퇴처리 완료",
        });
      })
      .catch((err) => {
        Promise.reject(err);
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      code: err.name,
      status: err.status || 500,
      message: err.message,
    });
  }
}
module.exports = {
  deleteMember,
};
