const express = require("express");

const router = express.Router();

const controller = require("../../controllers/auth");

const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.post(
  "/register",
  validateBody(schemas.userRegisterSchema),
  controller.register
);
router.post("/login", validateBody(schemas.userLoginSchema), controller.login);
router.post("/logout", authenticate, controller.logout);
router.get("/current", authenticate, controller.getCurrent);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.userSubscriptionSchema),
  controller.updateSubscription
);
router.patch('/avatars', authenticate, upload.single('avatar'), controller.updateAvatar)

module.exports = router;
