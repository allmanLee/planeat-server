const express = require("express");
const frizeAPI = require("./service.frize");
const jwt_check = require("../../../middlewares/auth");
const router = express.Router();

//해당 유저의 냉장고의 재료를 추가, 삭제, 검색을 하는 API
//냉장고 재료 검색
router.post("/frize/ingredientGet", jwt_check, frizeAPI.frizeIngredientGet);

//알람에 들어갈 냉장고 재료 검색
router.post(
  "/frize/alaramIngredient",
  jwt_check,
  frizeAPI.frizeIngredientAlaramGet
);

//냉장고 재료 추가 및 삭제
router.post("/frize/ingredient", jwt_check, frizeAPI.frizeIngredient);

//냉장고 재료 수정
//아이디와 수정값을 입력받는다.
router.post(
  "/frize/ingredientModify",
  jwt_check,
  frizeAPI.frizeIngredientModify
);

//해당 유저의 냉장고를 삭제, 추가, 검색을 하는 API
//유저 냉장고 검색
router.post("/frize/AllFrizeGet", jwt_check, frizeAPI.AllFrizeGet);

//유저 냉장고 추가
router.post("/frize/frizeAdd", jwt_check, frizeAPI.frizeAdd);

//유저 냉장고 삭제
router.delete("/frize/frizeDelete", jwt_check, frizeAPI.frizeDelete);
router.use("/check", jwt_check);
module.exports = router;
