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

function dice_emoji_replace(msg,s){

  if(msg.guild){
    console.log(s);
    const find_client_emoji = (name) = msg.guild.emojis.find(emoji => emoji.name === name).toString();
    const d4 = find_client_emoji("emoji_7") || "(d4)";
    const d6 = find_client_emoji("emoji_8") || "(d6)";
    const d8 = find_client_emoji("emoji_9") || "(d8)";
    const d10 = find_client_emoji("emoji_10") || "(d10)";
    const d20 = find_client_emoji("emoji_15") || "(d20)";
    return s.replace(/\(d4\):/g,d4)
             .replace(/\(d6\):/g,d6)
             .replace(/\(d8\):/g,d8)
             .replace(/\(d10\):/g,d10)
             .replace(/\(d20\):/g,d20)
             .replace(/\(d100\):/g,d10+d10);
   } else {
     return s;
   }
}

function format_roll_data(msg,data){
    if(2 <= data.number_of_rolls && data.number_of_rolls <= 15){
      return `${data.formula} = **${data.result}**`;
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
      await reply.edit(`${format_roll_data(msg,response.data)}`);
    }
}catch(error){
    if(error.response){
          console.error(`Response: ${error.response.status} – ${error.response.data} `);
    }
  }
}
