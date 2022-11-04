require("dotenv").config();
BOT_DATA = require("./../../index.js").BOT_DATA;

const func = async function(msg, args) {
  // Master command
  if (process.env.MASTER_USERS.includes(msg.author.id)) {
    msg.client.user.setPresence({
      status: 'online'
    });
    BOT_DATA.active = true;
    msg.channel.send("Guten Morgen!");
  } else {
    msg.reply(BOT_DATA.msgForbidden);
  }
}

module.exports = func;
func.docstring = "Setzt Spoilerzan wieder auf 'online', nachdem er vorher in den Schlaf versetzt wurde.";