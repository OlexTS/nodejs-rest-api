const express = require("express");
const { schemas } = require("../../models/contact");

const controller = require("../../controllers/contacts");
const {
  validateBody,
  postValidateBody,
  isValidId,
  authenticate,
} = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, controller.getContacts);

router.get("/:contactId", authenticate, isValidId, controller.getContactById);

router.post(
  "/",
  authenticate,
  postValidateBody(schemas.addSchema),
  controller.addNewContact
);

router.delete("/:contactId", authenticate, isValidId, controller.deleteContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.changeSchema),
  controller.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  controller.updateStatusContact
);

module.exports = router;
