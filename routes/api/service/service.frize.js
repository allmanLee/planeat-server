"use strict";
const models = require("../../../models");
const { v4 } = require("uuid");
const { sequelize } = require("../../../models");

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

// 이메일과 냉장고 이름에 일치하는 냉장고 갯수를 리턴.
async function searchedFrizeId(id, frizeName) {
  return await models.frize
    .findAndCountAll({
      attributes: ["frize_id"],
      where: { frize_name: frizeName, mem_id: id },
    })
    .then((data) => data.count)
    .catch((err) => Promise.reject(err));
}

//유저의 냉장고를 추가한다.
async function frizeAdd(req, res) {
  try {
    //db에 해당 냉장고와 동일한 이름이 있는지 검색
    //없으면 냉장고를 추가한다.
    const memId = await searchedId(req.body.email);
    const frizeName = req.body.frizeName;
    console.log(memId);
    const frizeExit = await searchedFrizeId(memId, frizeName);
    if (frizeExit === 0) {
      //아이디에 동일한 냉장고 이름이 없을 경우
      await models.frize.create({
        frize_id: v4().replace(/-/gi, ""),
        frize_update_date: "2021-10-24 00:00:00",
        frize_name: req.body.frizeName,
        frize_cate: "nomal",
        frize_is_shared: false,
        mem_id: memId,
      });
      res.status(200).json({
        status: "Success",
        code: 200,
        message: "냉장고를 추가 했습니다.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "이메일에 동일한 아이디가 있습니다.",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.messeage,
    });
  }
}

//유저의 냉장고를 삭제한다.
async function frizeDelete(req, res) {}

//유저의 냉장고들을 검색한다.
async function AllFrizeGet(req, res) {}

//냉장고에 재료들을 검색한다.
async function frizeIngredientGet(req, res) {
  try {
    const inputedEmail = req.query.email;
    const inputedFrizeName = req.body.frizeName;
    const id = await searchedId(inputedEmail);
    const ingredients = await models;
    res.send(200);
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      errdata: err,
      // errorCode: err.data.errorCode || err.data.code,
      //message: err.data.message,
    });
  }
}

//냉장고에 재료를 추가한다.
const frizeIngredientAdd = async function (req, res) {};

//냉장고에 특정재료를 삭제한다.
const frizeIngredientDelete = async function (req, res) {};

module.exports = {
  frizeIngredientGet,
  frizeIngredientAdd,
  frizeIngredientDelete,
  frizeAdd,
  frizeDelete,
  AllFrizeGet,
};
