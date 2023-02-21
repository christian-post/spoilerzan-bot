require("dotenv").config();
BOT_DATA = require("./../../index.js").BOT_DATA;

const fs = require("fs");

const loadSets = require("../utils.js").loadSets;
const getSet = require("../utils.js").getSet;


const func = async function(msg, args) {
  // args have to be a valid set codes (e.g. "sld"), separated by a space
  // removeSet --all removes every set from the list

  // Master command
  if (!process.env.MASTER_USERS.includes(msg.author.id)) {
    msg.reply(BOT_DATA.msgForbidden);
    return;
  }

  // --all removes every set
  if (args.includes("--all")) {
    fs.writeFileSync("./data/sets-to-watch.json", JSON.stringify([]));
    msg.channel.send("Alle Sets wurden erfolgreich entfernt");
    return;
  }

  let setsToWatch = loadSets();
  setsUpdated = [];

  for (const arg of args) {
    // convert set names to lowercase
    const setToRemove = arg.toLowerCase();

    // check if this set code is valid
    const setData = await getSet(setToRemove);
    if (setData) {
      // set is valid
      
      // check if this set is already in the data
      if (setsToWatch.includes(setToRemove)) {
        // remove the set
        setsToWatch.splice(setsToWatch.indexOf(setToRemove), 1);
        setsUpdated.push(setToRemove.toUpperCase());
      } else {
        msg.channel.send(`Set "${arg.toUpperCase()}" (${setData["name"]}) wird nicht beobachtet.`);
      }
    } else {
      msg.channel.send(`Unbekannter Set-Code: ${arg}`);
    }
  }

  if (setsUpdated.length > 0) {
    fs.writeFileSync("./data/sets-to-watch.json", JSON.stringify(setsToWatch));

    msg.channel.send(`Sets erfolgreich entfernt: ${setsUpdated.join(", ")}`);
  }
}

module.exports = func;
func.docstring = "Entfernt ein oder mehrere Sets aus der Beobachtung. Bsp.: !spoilerzan removeSet JMP ZNR KHM";