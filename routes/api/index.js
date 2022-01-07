const router = require("express").Router();
// const authMiddleware = require("../../middlewares/auth");
const auth = require("./auth");
const userController = require("./userController");
const service = require("./service");

router.use("/service", service);
router.use("/userController", userController);
router.use("/auth", auth);
router.use(function (req, res, next) {
  next();
});
module.exports = router;
