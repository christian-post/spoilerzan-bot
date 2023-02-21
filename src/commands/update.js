require("dotenv").config();
BOT_DATA = require("./../../index.js").BOT_DATA;

const checkSets = require("../utils.js").checkSets;
const postCards = require("../utils.js").postCards;


const func = async function(msg, args) {

  // flag if the cards should be posted to Discord
  let post = true;
  console.log(args)
  if (args && args.includes("--np")) post = false;

  let newCards = await checkSets();

  if (newCards.length > 0) {
    if (post) {
      msg.channel.send(`Update erfolgreich. ${newCards.length} neue Spoiler vorhanden.`);

      let channel = msg.client.channels.cache.get(process.env.SPOILER_CHANNEL);
      postCards(newCards, channel);
    }
  } else {
    msg.channel.send("Keine neuen Spoiler in den zu beobachtenden Sets.");
  }
}

module.exports = func;
func.docstring = "Lässt Spoilerzan nach neuen Spoilern suchen. \"update --np\" updatet ohne die Karten zu posten.";