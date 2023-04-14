const express = require("express");
const { schemas } = require("../../models/contact");

const controller = require("../../controllers/contacts");
const {
  validateBody,
  postValidateBody,
  isValidId,
} = require("../../middlewares");

const router = express.Router();

router.get("/", controller.getContacts);

router.get("/:contactId", isValidId, controller.getContactById);

router.post("/", postValidateBody(schemas.addSchema), controller.addNewContact);

router.delete("/:contactId", controller.deleteContact);

router.put(
  "/:contactId",
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
