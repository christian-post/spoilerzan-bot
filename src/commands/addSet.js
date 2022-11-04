require("dotenv").config();

const fs = require("fs");

const loadSets = require("../utils.js").loadSets; 
const loadCardCounts = require("../utils.js").loadCardCounts; 
const getSet = require("../utils.js").getSet;

const update = require("./update.js");


const func = async function(msg, args) {
  // args have to be a valid set codes (e.g. "sld"), separated by a space
  let setsToWatch = loadSets();
  let cardCounts = loadCardCounts();

  let setsUpdated = [];

  for (const arg of args) {
    // convert set names to lowercase
    const setToAdd = arg.toLowerCase();

    // check if this set code is valid
    const setData = await getSet(setToAdd);
    if (setData) {
      // set is valid

      // check if this set is already in the data
      if (setsToWatch.includes(setToAdd)) {
        msg.channel.send(`Set "${arg.toUpperCase()}" (${setData["name"]}) wird schon beobachtet.`);
        continue;
      }

      // add the set to the local data
      setsToWatch.push(setToAdd);
      cardCounts[setToAdd] = {
        // card_count: setData["card_count"]
        // set count to 0 so the cards get posted
        card_count: 0
      };

      setsUpdated.push(`${arg.toUpperCase()} (${setData["name"]})`);
    } else {
      msg.channel.send(`Unbekannter Set-Code: ${arg}`);
    }
  }

  if (setsUpdated.length > 0) {
    fs.writeFileSync("./data/sets-to-watch.json", JSON.stringify(setsToWatch));
    fs.writeFileSync("./data/set-card-counts.json", JSON.stringify(cardCounts));

    msg.channel.send(`Sets erfolgreich hinzugefügt: ${setsUpdated.join(", ")}`);

    // post the cards
    update(msg);
  }
}

module.exports = func;
func.docstring = "Fügt ein oder mehrere Sets zur Beobachtung hinzu. Bsp.: !spoilerzan addSet JMP ZNR KHM";