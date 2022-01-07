var express = require("express");
const jwt_check = require("../../../middlewares/auth");
const controller = require("./controller");
var router = express.Router();
router.get("/deleteMember", jwt_check, controller.deleteMember);

module.exports = router;
