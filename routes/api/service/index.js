const express = require("express");
const frizeAPI = require("./service.frize");
const router = express.Router();

//해당 유저의 냉장고의 재료를 추가, 삭제, 검색을 하는 API
//냉장고 재료 검색
router.get("/frize/ingredient", frizeAPI.frizeIngredientGet);

//냉장고 재료 추가
router.post("/frize/ingredient", frizeAPI.frizeIngredientAdd);

//냉장고 재료 삭제
router.delete("/frize/ingredient", frizeAPI.frizeIngredientDelete);

//해당 유저의 냉장고고를 삭제, 추가, 검색을 하는 API
//유저 냉장고 검색
router.get("/frize/AllFrizeGet", frizeAPI.AllFrizeGet);

//유저 냉장고 추가
router.post("/frize/frizeAdd", frizeAPI.frizeAdd);

//유저 냉장고 삭제
router.delete("/frize/frizeDelete", frizeAPI.frizeDelete);

module.exports = router;
