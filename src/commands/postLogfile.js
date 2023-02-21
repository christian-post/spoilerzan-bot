require("dotenv").config();
BOT_DATA = require("../../index.js").BOT_DATA;
const fs = require("fs");


const splitText = function(str, limit) {
  // https://stackoverflow.com/questions/49836558/split-string-at-space-after-certain-number-of-characters-in-javascript

  if (limit === undefined) {
	console.log('No limit for splitText. Default value set (1000).');
	limit = 1000;
  }

  const regex = new RegExp(`.{1,${limit}}(?=\\s|$)`, 'g');
  let chunks = str.match(regex);
  return chunks;
}


const func = async function(msg, args) {
  if (!BOT_DATA.active) return;

  // Master command
  if (process.env.MASTER_USERS.includes(msg.author.id)) {
    
    let logfileData;
    try {
      logfileData = fs.readFileSync("./my_log.log", 'utf8');
    } catch(e) {
      console.log(e);
      logfileData = null;
    }

    // check if char limit is reached (includes formatting characters)
    const charLimit = process.env.CHAR_LIMIT - 10;

    if (logfileData) {
      if (logfileData.length > charLimit) {
        let chunks = splitText(logfileData, charLimit);
        chunks.forEach(chunk => {
          msg.channel.send(`\`\`\`${chunk}\`\`\``);
        });
      } else {
        msg.channel.send(`\`\`\`${logfileData}\`\`\``);
      }
    } else {
      msg.channel.send('Dieser Logfile ist nicht vorhanden.');
    }

  } else {
    msg.reply(BOT_DATA.msgForbidden);
  }
}

module.exports = func;
func.docstring = "Spoilerzan postet den Logfile auf Discord.";