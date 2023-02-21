require("dotenv").config();

const commands = {
  randomcard: require("./commands/randomcard.js"),
  status: require("./commands/status.js"),
  sleep: require("./commands/sleep.js"),
  wake: require("./commands/wake.js"),
  update: require("./commands/update.js"),
  sets: require("./commands/sets.js"),
  addSet: require("./commands/addSet.js"),
  removeSet: require("./commands/removeSet.js"),
  postLogfile: require("./commands/postLogfile.js"),
  // setInterval: require("./commands/setInterval.js"),
}


module.exports = async function(msg) {
  /*
  example msg.content:
    CMD_CHAR    command  token(s)
	!spoilerzan sleep    1000
  */

  let tokens = msg.content.split(" ");
  let cmd_char = tokens.shift();
  let command = tokens.shift();
  
  if (cmd_char === process.env.CMD_CHAR) {
    if (command in commands) {
      commands[command](msg, tokens);
      console.log(msg.content);
    } else {
      let text = "Ich kenne diesen Befehl nicht.\nVerfügbare Befehle:\n```";

      Object.entries(commands).forEach(([name, func]) => {
        // determine num of tabs for formatting
        // TODO: determine longest function name programmatically
        let tabs = " ".repeat(12 -name.length);

        text += `${name}${tabs}${func.docstring || " "}\n`;
      });

      msg.reply(text + "```");
    }
  }
}