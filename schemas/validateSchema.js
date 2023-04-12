const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^(\+38)\s?\(?\d{3}\)?\s?\d{3}-?\d{4}$/)
    .required(),
});

const changeSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^(\+38)\s?\(?\d{3}\)?\s?\d{3}-?\d{4}$/),
});

module.exports = { addSchema, changeSchema };
