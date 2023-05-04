const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require('nanoid');
require('dotenv').config()

const { User } = require("../models/user");

const { HttpError, ctrlWrapper, formatJimp, sendEmail } = require("../helpers");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const createHashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid()

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    avatarURL,
    verificationToken
  });

  const verifyEmail = {
    to: email,
    subject: 'verify email',
    html: `<a target='_blank' href='${BASE_URL}/users/verify/${verificationToken}'>Please click to verify your email</a>`
   }

  await sendEmail(verifyEmail)
  
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async(req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken })
    if (!user) {
    throw HttpError(404, "User not found")
  }
  await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true })
  res.json({message: 'Verification successful'})
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "missing required field email")
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed")
  }
  const verifyEmail = {
    to: email,
    subject: 'verify email',
    html: `<a target='_blank' href='${BASE_URL}/users/verify/${user.verificationToken}'>Please click to verify your email</a>`
   }

  await sendEmail(verifyEmail)
  res.json({message: "Verification email sent"})
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Not veryfied")
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "No Content" });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const result = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const newName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, newName);
  await formatJimp(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", newName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
};
