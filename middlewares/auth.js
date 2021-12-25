const jwt = require("jsonwebtoken");
const models = require("../models");
const authMiddleware = (req, res, next) => {
  // read the token from header or url
  let token = req.headers["x-access-token"] || req.query.token;

  // token does not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "not logged in",
      // error
    });
  }

  // 토큰 디코드하는 비동기 promise 객체 생성
  const accessDecode = new Promise((resolve, reject) => {
    jwt.verify(
      token,
      req.app.get("jwt-secret") || process.env.JWTSECRET_KEY,
      (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      }
    );
  });

  // 실패했을테 에러 메세지를 보낸다.
  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  // process the promise
  accessDecode
    .then((decoded) => {
      req.decoded = decoded;
      console.log(decoded);
      next();
    })
    .catch(onError);
};

module.exports = authMiddleware;
