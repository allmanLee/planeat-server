"use strict";
const models = require("../../../models");
const { v4 } = require("uuid");
const { sequelize } = require("../../../models");

//db에서 재료 객체를 가져와 리턴합니다.
//option=1 : 그대로 option=2: 아이디를 키값으로한 객체 리턴
async function findIngredientObj(frizeId, option) {
  return await models.frize_include_ingredient
    .findOne({
      attributes: ["frinclude_ingredient"],
      where: {
        frize_id: frizeId,
      },
    })
    .then((data) => {
      if (data !== null) {
        const items = data.frinclude_ingredient;
        if (option === 1) {
          return items;
        } else {
          return items.reduce((acc, el) => {
            return {
              ...acc,
              [el.id]: {
                name: el.name,
                engName: el.engName,
                updatedDate: el.updatedDate,
                amount: el.amount,
                id: el.id,
              },
            };
          }, {});
        }
      }
    })
    .catch((err) => {
      Promise.reject(err);
    });
}

//재료를 객체에서 추가 또는 삭제를 합니다.

/***첫번쨰 인자는 기존 재료 객체입니다.
  두번째 인자는 추가되는 배열입니다.
  세번째 인자는 삭제할 배열입니다.***/
async function updateIngredientObj(frizeId, ingredientObj, addObj, cancleArr) {
  //두번째 인자가 들어오지 않았다면 추가
  let resultObj = ingredientObj;
  resultObj = { ...ingredientObj, ...addObj };
  if (arguments[3] === undefined) {
    await models.frize_include_ingredient
      .update(
        { frinclude_ingredient: resultObj },
        { where: { frize_id: frizeId } }
      )
      .catch((err) => Promise.reject(err));
  } else {
    //먼저 객체에서 cancleObj의 아이디에 해당하는 데이터들을 삭제하고
    //두번째 인자가 들어왔을 경우 삭제
    cancleArr.forEach((el) => {
      delete resultObj[el];
    });
    models.frize_include_ingredient
      .update(
        { frinclude_ingredient: Object.values(resultObj) },
        { where: { frize_id: frizeId } }
      )
      .catch((err) => Promise.reject(err));
  }
  console.log(Object.values(resultObj));
  return Object.values(resultObj);
}

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

// 이메일과 냉장고 이름에 일치하는 냉장고 아이디와 갯수를 리턴.
async function searchedFrizeId(id, frizeName) {
  return await models.frize
    .findAndCountAll({
      attributes: ["frize_id"],
      where: { frize_name: frizeName, mem_id: id },
    })
    .then((data) => data)
    .catch((err) => Promise.reject(err));
}

//유저의 냉장고를 추가한다.
async function frizeAdd(req, res) {
  try {
    //db에 해당 냉장고와 동일한 이름이 있는지 검색
    //없으면 냉장고를 추가한다.
    const memId = await searchedId(req.body.email);
    const frizeName = req.body.frizeName;
    const frizeId = v4().replace(/-/gi, "");
    const frizeExit = await searchedFrizeId(memId, frizeName);
    if (frizeExit.count === 0) {
      //아이디에 동일한 냉장고 이름이 없을 경우
      await models.frize.create({
        frize_id: frizeId,
        frize_update_date: "2021-10-24 00:00:00",
        frize_name: req.body.frizeName,
        frize_alarm: false,
        frize_cate: "nomal",
        frize_is_shared: false,
        mem_id: memId,
      });
      res.status(200).json({
        status: "Success",
        code: 200,
        message: "냉장고를 추가 했습니다.",
        dataObj: {
          frizeName: frizeName,
          frizeId: frizeId,
        },
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
async function frizeDelete(req, res) {
  try {
    //db에 해당 냉장고와 동일한 이름이 있는지 검색
    //없으면 냉장고를 추가한다.
    const memId = await searchedId(req.body.email);
    const frizeName = req.body.frizeName;
    const frizeSearched = await searchedFrizeId(memId, frizeName);
    const frizeId = frizeSearched.rows[0].frize_id;
    if (frizeId !== undefined) {
      //아이디에 동일한 냉장고 이름이 없을 경우
      await models.frize.destroy({
        where: {
          frize_id: frizeId,
        },
      });
      res.status(200).json({
        status: "Success",
        code: 200,
        dataObj: {
          frizeId: frizeId,
        },
        message: "냉장고를 정상적으로 삭제 했습니다.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "이메일에 동일한 아이디가 있습니다.",
      });
    }
  } catch (err) {
    res.status(400).json({
      code: "정하지 않음",
      message: err.message,
    });
  }
}

//유저의 냉장고들을 검색하고 아이디들을 담은 배열을 리턴한다.
async function AllFrizeGet(req, res) {
  try {
    const frizeCate = req.body.frize_category || null;
    const memId = await searchedId(req.body.email);
    let frizeFindOpt =
      frizeCate === null
        ? { mem_id: memId }
        : { mem_id: memId, frize_cate: frizeCate };

    //만약 카테고리가 있다면
    const addedFrizes = await models.frize
      .findAll({
        attributes: ["frize_id", "frize_name"],
        where: frizeFindOpt,
      })
      .then((data) =>
        data.map((el) => {
          return { frizeId: el.frize_id, frizeName: el.frize_name };
        })
      )
      .catch((err) => Promise.reject(err));
    res.status(200).json({
      success: true,
      message: "성공적으로 해당 이메일의 frizesID를 가져왔습니다.",
      dataObj: addedFrizes,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      code: err.name,
      status: err.status || 400,
      message: err.message,
    });
  }
}

//냉장고에 재료들을 검색한다.
async function frizeIngredientGet(req, res) {
  try {
    //아이디를 찾아서 수정하는 방식에서 냉장고 아이템을 그냥 가져오는것으로 수정 함
    // const inputedEmail = req.body.email;
    // const inputedFrizeName = req.body.frizeName;
    // const id = await searchedId(inputedEmail);
    //const frizeData = await searchedFrizeId(id, inputedFrizeName);
    // const frizeId = await frizeData.rows[0].frize_id;
    const frizeId = req.body.frizeId;
    const ingredientObj = await findIngredientObj(frizeId, 1);

    res.status(200).json({
      success: true,
      message: "성공적으로 frizesID의 이메일을 가져왔습니다.",
      dataObj: [ingredientObj],
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
      //errorCode: err.data.errorCode || err.data.code,
      //message: err.data.message,
    });
  }
}

//냉장고에 재료를 추가 또는 삭제
const frizeIngredient = async function (req, res) {
  try {
    // const memEmail = req.body.email;
    // const frizeName = req.body.frizeName;
    // const memId = await searchedId(memEmail);
    // const frizeSearched = await searchedFrizeId(memId, frizeName);
    // const frizeId = (await frizeSearched.rows[0].frize_id) || null;
    const frizeId = req.body.frizeId;
    const ingredientDelelte = req.body.ingredientDelete;
    const ingredientAdd = req.body.ingredientAdd;
    const ingredientAddObj =
      ingredientAdd !== null
        ? ingredientAdd.reduce((acc, el) => {
            return {
              ...acc,
              [el.id]: {
                name: el.name,
                engName: el.engName,
                updatedDate: el.updatedDate,
                amount: el.amount,
                id: el.id,
              },
            };
          }, {})
        : null;
    let updatedIngredients = [];
    const ingredientObj = await findIngredientObj(frizeId, 2); //현재 재료데이터
    console.log("검색된 재료2", ingredientObj);
    if (ingredientObj != null) {
      //frizeId가 frize_include_ingredient 테이블에 존재할경우 업데이트

      updatedIngredients = await updateIngredientObj(
        frizeId,
        ingredientObj,
        ingredientAddObj,
        ingredientDelelte
      );
    } else {
      await models.frize_include_ingredient
        .create({
          frinclude_ingredient: ingredientAddObj,
          frize_id: frizeId,
        })
        .catch((err) => Promise.reject(err));
    }
    res.status(200).json({
      success: true,
      message: "성공적으로 제료가 추가되었습니다.",
      dataObj: updatedIngredients,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  frizeIngredientGet,
  frizeIngredient,
  frizeAdd,
  frizeDelete,
  AllFrizeGet,
};
