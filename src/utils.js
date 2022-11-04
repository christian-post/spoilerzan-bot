const fetch = (...args) => 
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fs = require("fs");
require("dotenv").config();


const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const getSet = async function(code) {
  await sleep(process.env.SLEEP_TIME);
  const res = await fetch(`https://api.scryfall.com/sets/${code}`);
  if (res.status === 200) {
    const setData = await res.json();
    return setData;
  } else {
    console.log(`The set "${code}" could not be accessed. Error code ${res.status}.`);
    return null;
  }
}


const getSpoiledCards = async function(setData) {
  const url = `https://api.scryfall.com/cards/search?order=spoiled&unique=prints&q=e%3A${setData["code"]}`;
  const res = await fetch(url);
  if (res.status === 200) {
    const cards = await res.json();
    return cards;
  } else {
    console.log(`Error fetching cards for "${setData["code"]}" at ${url}. Error code ${res.status}.`);
    return null;
  }
}


const loadSets = function() {
  const rawSetData = fs.readFileSync("./data/sets-to-watch.json", 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return null;
    }
    return data;
  });
  return JSON.parse(rawSetData);
}


const loadCardCounts = function() {
  const fpath = "./data/set-card-counts.json";
  const rawCardCounts = fs.readFileSync(fpath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return null;
    }
    return data;
  });

  return JSON.parse(rawCardCounts);
}


const formatCardDataForPost = function(data) {
  // makes a string from the card data that gets posted to Discord
  return `${data?.scryfall_uri}

${data?.name} ${data?.mana_cost}
${data?.type_line}
${data?.oracle_text}
${data?.image_uris?.normal}
  `;
}


const checkSets = async function() {
  const sets = loadSets();
  const cardCounts = loadCardCounts();

  // error checking
  if (!sets || !cardCounts) {
    console.log("There is something wrong with the set data or card counts data.");
    return [];
  }

  let timestamp = new Date().toLocaleString();
  console.log(timestamp + " - checking for updates");

  // flag to set to true if card counts changed
  let hasUpdated = false;

  let newCards = [];

  for (let set of sets) {
    const setData = await getSet(set);

    if (!setData) continue;  // set doesn't exist

    // check if the card count is the same as in the data
    let newCount = setData?.["card_count"] || 0;
    let oldCount = cardCounts[setData["code"]]?.["card_count"] || 0;

    console.log(set, newCount, oldCount);

    if (newCount > oldCount) {
      // This means that new cards have been spoiled
      let numCardsSpoiled = newCount - oldCount;

      const cards = await getSpoiledCards(setData);
      if (!cards) continue;

      cards.data.slice(0, numCardsSpoiled).forEach(cardData => {
         newCards.push(formatCardDataForPost(cardData));
      });

      // update the card count in the local data
      cardCounts[setData["code"]].card_count = newCount;

      hasUpdated = true;
    }
  }
  if (hasUpdated) {
    // update the local file
    try {
      fs.writeFileSync(
        "./data/set-card-counts.json", 
        JSON.stringify(cardCounts), 
        { flag: 'w+' }
      );
      // file written successfully
    } catch (err) {
      console.error(err);
    }
  }
  return newCards;
}


const postCards = async function(cardlist, channel) {
  for (card of cardlist) {
    await sleep(300);
    channel.send(card);
  }
}


const getSetnames = async function() {
  // returns an Array with all setnames from scryfall that are currently being watched
  const sets = loadSets();

  return Promise.all(sets.map(async set => {
    let s = await getSet(set);
    return s.name;
  }));
}


const getSets = async function() {
  // returns an Array with all sets from scryfall that are currently being watched
  const sets = loadSets();
  return Promise.all(sets.map(getSet));
}


const isNumeric = function(n) { 
  return !isNaN(parseFloat(n)) && isFinite(n); 
}


const safeSend = function(message, text) {
  // before replying to a message, this function checks the character limit and splits if needed

  // can not send an empty message
  if (text.length === 0) {
    return;
  }

  // check text length
  if (text.length <= process.env.CHAR_LIMIT) {
    // everything is okay
    message.channel.send(text);
  } else {
    let splitText = text.split(" ");
    let textToSend = "";
    // put chunks of text from the array together until the char limit is reached
    while (splitText.length > 0) {
      let elem = splitText.shift();
      if (textToSend.length + elem.length < process.env.CHAR_LIMIT) {
        // message length is still fine
        textToSend += elem;
      } else {
        // message would be too long
        // post current log and clear variable
        message.channel.send(textToSend);
        textToSend = "";
      }
    }
  }
}


module.exports = {
  sleep: sleep,
  getSet: getSet,
  getSetnames: getSetnames,
  getSets: getSets,
  checkSets: checkSets,
  isNumeric: isNumeric,
  postCards: postCards,
  loadSets: loadSets,
  loadCardCounts: loadCardCounts,
  safeSend: safeSend
};