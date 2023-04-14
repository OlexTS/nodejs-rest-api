const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getContacts = async (req, res, next) => {
  const result = await Contact.find();
  console.log(result);
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addNewContact = async (req, res, next) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing field favorite");
  }
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
