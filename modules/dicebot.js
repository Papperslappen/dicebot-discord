const config = require('../config.js');
const axios = require('axios')
const sleep = require('util').promisify(setTimeout)

module.exports = {
    init: function(client){
        client.on('message',(msg) => {
          if(msg.content.length <= 20){
            roll(msg).then(console.log).catch(console.err);
          }
        })
    }
}

function dice_emoji_replace(s){
  return s.replace(/\(d4\):/g," :emoji_7: ")
           .replace(/\(d6\):/g," :emoji_8: ")
           .replace(/\(d8\):/g," :emoji_9: ")
           .replace(/\(d10\):/g," :emoji_10: ")
           .replace(/\(d20\):/g," :emoji_15: ")
           .replace(/\(d100\):/g," :emoji_10: :emoji_10: ")
}

function format_roll_data(data){
    if(data.number_of_rolls >= 2 && data.number_of_rolls<=15){
      return `${dice_emoji_replace(data.formula)} = **${data.result}**`;
    }else{
      return (`🎲**${data.result}** 🎲`);
    }

}

async function roll(msg){
  try{
    const response = await axios.get(`http://${config.dicebot.url}:${config.dicebot.port}/roll/${msg.content}`);
    if(response.data.result && !response.data.trivial){
      let reply = await msg.reply(`🎲${msg.content}🎲`);
      await sleep(200);
      await reply.edit(`${format_roll_data(response.data)}`);
    }
}catch(error){
    if(error.response){
          console.error(`Response: ${error.response.status} – ${error.response.data} `);
    }
  }
}
