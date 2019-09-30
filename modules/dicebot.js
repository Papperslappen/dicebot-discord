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


async function roll(msg){
  try{
    const response = await axios.get(`http://${config.dicebot.url}:${config.dicebot.port}/roll/${msg.content}`);
    if(response.data.result && !response.data.trivial){
      let reply = await msg.reply(`🎲${msg.content}🎲`);
      await sleep(200);
      await reply.edit(`🎲 ${response.data.result} 🎲`)
    }
}catch(error){
    if(error.response && error.response.status != 404){
          console.error(error);
    }
  }
}
