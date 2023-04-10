const express = require("express");
const {addSchema, changeSchema}  = require('../../schemas/validateSchema');
// const vvalidateBody = require('../../middlewares/validateBody')
// const Joi = require("joi");

// const bodySchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().required(),
//   phone: Joi.string().required(),
// });
// .phoneNumber({ defaultCountry: 'UK', format: 'e164' }).validate('494322456')
// const contacts = require("../../models/contacts");
// const { HttpError } = require("../../helpers");
const controller = require('../../controllers/contacts');
const validateBody = require("../../middlewares/validateBody");

const router = express.Router();

router.get("/", controller.getContacts);

router.get("/:contactId", controller.getContactById);

router.post("/", validateBody(addSchema), controller.addNewContact);

router.delete("/:contactId", controller.deleteContact);

router.put("/:contactId", validateBody(changeSchema), controller.updateContact);

module.exports = router;
