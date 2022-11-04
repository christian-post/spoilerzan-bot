require("dotenv").config();
BOT_DATA = require("../../index.js").BOT_DATA;

const isNumeric = require("../utils.js").isNumeric;


module.exports = async function(msg, args) {
  if (!BOT_DATA.active) return;

  // Master command
  if (process.env.MASTER_USERS.includes(msg.author.id)) {
    // args[0] has to be integer
    if (isNumeric(args[0])) {
      BOT_DATA.checkInterval = parseInt(args[0]);
    } else {
      msg.reply(BOT_DATA.msgWrongArgs);
    }
  } else {
    msg.reply(BOT_DATA.msgForbidden);
  }
}