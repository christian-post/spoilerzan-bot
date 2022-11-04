require("dotenv").config();
BOT_DATA = require("../../index.js").BOT_DATA;

const func = async function(msg, args) {
  if (!BOT_DATA.active) return;

  // Master command
  if (process.env.MASTER_USERS.includes(msg.author.id)) {
    msg.client.user.setPresence({
      status: "dnd"
    });
    BOT_DATA.active = false;
    msg.channel.send("Gute Nacht!");

    // TODO: optional time parameter (in s) in args to wake the bot up
  } else {
    msg.reply(BOT_DATA.msgForbidden);
  }
}

module.exports = func;
func.docstring = "Setzt Spoilerzan auf 'DnD' (reagiert nicht auf Commands und postet keine Spoiler).";