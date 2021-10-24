const express = require("express");
const jwt_check = require("../../../middlewares/auth");
const authRegisterAPI = require("./auth.registerUser");
const authSendEmailAPI = require("./auth.sendEmail");
const router = express.Router();

//회원가입 POST API
router.post("/register", authRegisterAPI.MemberRegister);

//이메일 중복 확인 API
router.get("/check_email", authRegisterAPI.MemberCheckEmail);

//인증 이메일 보내기 API
router.post("/send_auth_email", authSendEmailAPI.SendAuthEmail);
router.post(
  "/send_change_password_email",
  authSendEmailAPI.SendChangePasswordEmail
);
router.post("/check_authkey", authRegisterAPI.MemberCheckAuthKey);

router.use("/check", jwt_check);
router.get("/check", authRegisterAPI.TokenCheck);
module.exports = router;
