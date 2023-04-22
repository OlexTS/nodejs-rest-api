const express = require("express");

const router = express.Router();

const controller = require("../../controllers/auth");

const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.post(
  "/register",
  validateBody(schemas.userRegisterSchema),
  controller.register
);
router.post("/login", validateBody(schemas.userLoginSchema), controller.login);
router.post('/logout', authenticate, controller.logout)
router.get('/current', authenticate, controller.getCurrent)

module.exports = router;
