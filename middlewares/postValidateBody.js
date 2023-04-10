const HttpError = require("../helpers/HttpError");

const availableFields = (object) => {
  const objectFields = ["name", "email", "phone"];
  const fields = objectFields.filter((field) => object[field] === undefined);
  return `missing required ${fields[0]} field`;
};

const postValidateBody = (schema) => {
  const foo = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, availableFields(req.body)));
    }
    next();
  };
  return foo;
};

module.exports = postValidateBody;
