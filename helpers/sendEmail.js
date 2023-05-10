const sgEmail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, USER_EMAIL } = process.env;

sgEmail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: USER_EMAIL };
  await sgEmail.send(email);
  return true;
};

module.exports = sendEmail;