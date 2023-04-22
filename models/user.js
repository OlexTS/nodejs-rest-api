const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { mongooseError } = require("../helpers");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String
}, { versionKey: false })

userSchema.post("save", mongooseError);

const userRegisterSchema = Joi.object({
    password: Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/).required(),
    email: Joi.string().pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/).required(),
    subscription: Joi.string(),
})

const userLoginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/).required(),
    
})



const schemas = {userRegisterSchema, userLoginSchema}

const User = model('user', userSchema);

module.exports = {
    User, schemas
}