const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const getContacts = async (req, res, next) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const result = await contacts.getById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addNewContact = async (req, res, next) => {
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  console.log(result);
  if (Object.keys(req.body).length === 0 ) {
    throw HttpError(400, "missing fields");
  }
  if (!result) {
    throw HttpError(404, 'Not found')
  }
  res.json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};
