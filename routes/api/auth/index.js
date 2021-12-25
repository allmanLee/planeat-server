const express = require("express");
const jwt_check = require("../../../middlewares/auth");
const authLoginUser = require("./auth.loginUser");
const authRegisterAPI = require("./auth.registerUser");
const authSendEmailAPI = require("./auth.sendEmail");
const refreshAccessToken = require("../../../middlewares/refresh");
const router = express.Router();

//회원가입 POST API
router.post("/login", authLoginUser.login);
router.post("/register", authRegisterAPI.MemberRegister);

//이메일 중복 확인 API
router.get("/check_email", authRegisterAPI.MemberCheckEmail);

//인증 이메일 보내기 API
router.post("/send_auth_email", authSendEmailAPI.SendAuthEmail);

//패스워드 변경 이메일 전송 API
router.post(
  "/send_change_password_email",
  authSendEmailAPI.SendChangePasswordEmail
);

//인증키 확인
router.post("/check_authkey", authRegisterAPI.MemberCheckAuthKey);

//access 토큰 재발급
router.get("/refresh", refreshAccessToken);

//JWT 확인
router.use("/check", jwt_check);
router.get("/check", authRegisterAPI.TokenCheck);
module.exports = router;
