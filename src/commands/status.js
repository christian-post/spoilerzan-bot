require("dotenv").config();
BOT_DATA = require("./../../index.js").BOT_DATA;

const formatTimestamp = function(timeMs) {
  let timeS = Math.round(timeMs / 1000);
  console.log(timeS)
  return {
    days: Math.floor(timeS / 86400).toString(),
    hours: (Math.floor(timeS / 3600) % 24).toString().padStart(2, "0"),
    minutes: (Math.floor(timeS / 60) % 60).toString().padStart(2, "0"),
    seconds: (timeS % 60).toString().padStart(2, "0")
  };
}


const func = async function(msg, args) {
  if (!BOT_DATA.active) return;
  
  // Master command
  if (process.env.MASTER_USERS.includes(msg.author.id)) {
    let time = formatTimestamp(Date.now() - BOT_DATA.running.getTime());
    let start = BOT_DATA.running.toLocaleString("de-DE",{ dateStyle: "medium" });
    if (time.days >= 1) {
      msg.channel.send(`Online seit ${start} (${time.days} Tag(e))`);
    } else {
      msg.channel.send(`Online seit ${start} (${time.hours}:${time.minutes}:${time.seconds}).`);
    }
  } else {
    msg.reply(BOT_DATA.msgForbidden);
  }
}

module.exports = func;
func.docstring = "Zeigt an, wie lange Spoilerzan bereits online ist.";