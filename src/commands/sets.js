require("dotenv").config();
BOT_DATA = require("./../../index.js").BOT_DATA;
const getSets = require("../utils.js").getSets;


const func = async function(msg, args) {
  if (!BOT_DATA.active) return;

  getSets().then(sets => {
    let setnames = [];
    let setUris = [];
    for (let set of sets) {
      setnames.push(`${set.name} (${set.code.toUpperCase()})`);
      setUris.push(set.scryfall_uri);
    }

    let str = "Sets unter Beobachtung:";

    for (let i = 0; i < sets.length; i++) {
      str += "\n• "
      str += setnames[i] + "\n";
      str += "   " + setUris[i] + "?order=spoiled";
    }

    msg.channel.send(str).then(botMsg => {
      botMsg.suppressEmbeds(true);
    });
    
  });
}

module.exports = func;
func.docstring = "Postet die aktuell unter Beobachtung stehenden Sets.";