const jimp = require("jimp");

const formatJimp = async (path) => {
  try {
    const avatar = await jimp.read(path);
    await avatar.contain(250, 250);
    await avatar.resize(250, 250);
    await avatar.writeAsync(path);
  } catch (error) {
    console.log(error);
  }
};

module.exports = formatJimp;
