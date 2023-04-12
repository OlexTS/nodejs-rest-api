const HttpError = require("../helpers/HttpError");

const availableFields = (object) => {
  const objectFields = ["name", "email", "phone"];
  const fields = objectFields.filter((field) => object[field] === undefined);
  return fields.length > 1
    ? `missing required ${fields.join(", ")} fields`
    : `missing required ${fields[0]} field`;
};

const postValidateBody = (schema) => {
  const foo = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (Object.keys(req.body).length < 3) {
      next(HttpError(400, availableFields(req.body)));
    }
    if (error) {
      next(HttpError(400, error.message));
    }

    next();
  };
  return foo;
};

module.exports = postValidateBody;
