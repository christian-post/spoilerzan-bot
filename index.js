require("dotenv").config();
const Discord = require("discord.js");

const checkSets = require("./src/utils.js").checkSets;
const postCards = require("./src/utils.js").postCards;


exports.BOT_DATA = {
  active: true,
  running: new Date(),
  checkInterval: 30 * 60 * 1000,
  msgForbidden: "Du hast nicht die Berechtigung, dies zu benutzen.",
  msgWrongArgs: "FEHLER: Ungültiges Argument für diesen Befehl.",
  msgNoLogs: "Kein Logfile vorhanden."
};



// create new client
const client = new Discord.Client(); 

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Bereit für Schabernack"); 
});

const commandHandler = require("./src/commands.js");
client.on("message", commandHandler);


// TODO: put this function definition somewhere else?
const checkSetsRepeatedly = async function() {
  if (!BOT_DATA.active) return;

  console.log('Checking for spoilers...');

  // this function is called automatically 
  let newCards = await checkSets();

  if (newCards.length > 0) {
    let channel = client.channels.cache.get(process.env.SPOILER_CHANNEL);
    postCards(newCards, channel);
    // console.log(`Neue Spoiler: ${newCards}`);
  } else {
    console.log("Keine neuen Spoiler.");
  }
  setTimeout(checkSetsRepeatedly, BOT_DATA.checkInterval);
}

// start watching for spoilers periodically
setTimeout(checkSetsRepeatedly, BOT_DATA.checkInterval);

// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token


