const fetch = (...args) => 
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const sleep = require("../utils.js").sleep;

const getRandomCard = async function() {
  await sleep(500);
  const res = await fetch("https://api.scryfall.com/cards/random");
  const cardData = await res.json()
  return cardData.image_uris.normal;
}


const func = async function(msg, args) {
  getRandomCard().then(image => {
    msg.channel.send(image);
  });
}

module.exports = func;
func.docstring = "Postet eine zufällige Karte.";
