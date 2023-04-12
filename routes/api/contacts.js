const express = require("express");
const { addSchema, changeSchema } = require("../../schemas/validateSchema");

const controller = require("../../controllers/contacts");
const { validateBody, postValidateBody } = require("../../middlewares");

const router = express.Router();

router.get("/", controller.getContacts);

router.get("/:contactId", controller.getContactById);

router.post("/", postValidateBody(addSchema), controller.addNewContact);

router.delete("/:contactId", controller.deleteContact);

router.put("/:contactId", validateBody(changeSchema), controller.updateContact);

module.exports = router;
