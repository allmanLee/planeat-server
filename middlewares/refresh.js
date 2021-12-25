const jwt = require("jsonwebtoken");
const models = require("../models");
const refreshMiddleware = (req, res, next) => {
  // read the token from header or url
  let token = req.headers["x-access-token"] || req.query.token;
  const refreshToken = req.headers["x-refresh-token"] || req.query.reftoken;

  // token does not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "access-token이 없습니다.",
      // error
    });
  }

  // re-token does not exist
  if (!refreshToken) {
    return res.status(403).json({
      success: false,
      message: "refresh-token이 없습니다.",
      // error
    });
  }

  // 토큰 디코드하는 비동기 promise 객체 생성
  const refreshDecode = new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      req.app.get("jwt-secret") || process.env.JWTSECRET_KEY,
      (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      }
    );
  });

  // 디코드 실패했을테 에러메세지.
  const onError = (error) => {
    res.status(403).json({
      success: false,
      message:
        error.message === "jwt expired" ? "must be re login" : error.message,
    });
  };

  // refresh 토큰이 없을때 에러메세지.(DB ERROR)
  const onRecentError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  // 현재 가지고있는 ACCESS 토큰이 최근에 사용한 acc토큰인지 검사
  async function FindRecentToken() {
    let result = await models.member
      .findOne({
        attributes: ["mem_recent_token"],
        where: { mem_ref_token: refreshToken },
      })
      .then((data) => data.mem_recent_token)
      .catch(onRecentError);
    return result;
  }

  //리프레시 토큰으로 이메일 찾기
  async function FindEmailbyRefresh() {
    let result = await models.member
      .findOne({
        attributes: ["mem_email"],
        where: { mem_ref_token: refreshToken },
      })
      .then((data) => data.mem_email)
      .catch(onRecentError);
    return result;
  }

  //새로운 access-token 생성
  const createToken = (email) =>
    jwt.sign({ mem_email: email }, process.env.JWTSECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "20m",
    });

  //최근 접근 토큰이 일치하지 않을경우
  const ErrRecentTokenMismatch = () => {
    res.status(403).json({
      success: false,
      message: "최근 접근 토큰과 해당 토큰이 불일치",
    });
  };

  // process the promise
  async function recentTokenComparison() {
    const recent = await FindRecentToken();
    if (token === recent) {
      refreshDecode
        .then(async (decoded) => {
          const email = await FindEmailbyRefresh();
          req.decoded = decoded;
          const token = await createToken(email);
          models.member.update(
            { mem_recent_token: token },
            { where: { mem_ref_token: refreshToken } }
          );
          res.status(200).json({
            accessToken: token,
          });
        })
        .catch(onError);
    } else ErrRecentTokenMismatch();
  }

  recentTokenComparison();
};

module.exports = refreshMiddleware;
