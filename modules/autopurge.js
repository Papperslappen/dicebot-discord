const config = require("../config.js");

var _timeouts = {};
module.exports = {
    init: function(client){
        client.on('message',(msg) => {
            if(is_autopurging(msg.channel)){
                //Only post a warning message once until the channel has been cleared
                if(_timeouts[msg.channel.id]){ 
                    client.clearTimeout(_timeouts[msg.channel.id]);
                }else{
                    msg.channel.send(`⚠️ Denna kanal rensas från allt utom fästa meddelanden efter en stunds inaktivitet för att relevant information ska finnas kvar,
                    fortstätt gärna eventuell diskussion i någon annan kanal ⚠️`); //TODO: Make this message configurable
                }
                _timeouts[msg.channel.id] = client.setTimeout((msg)=>{
                    delete _timeouts[msg.channel.id];
                    deleteAllNonePinnedFrom(msg.channel).catch(console.err);
                },config.discord.autopurgetime,msg);
            }       
        });
    }
}

function is_autopurging (channel){
    return channel.id == config.discord.autopurgechannel;
}

async function deleteAllNonePinnedFrom(channel){
    if(channel.type == "text"){
        const messages = await channel.fetchMessages();
        const deleted = await channel.bulkDelete(messages.filter((msg)=>{return msg.deletable && !msg.pinned;}),true);
        console.log(`deleteAllNonePinnedFrom deleted ${deleted.size} messages`);
        //channel.messages.filter((msg)=>{return msg.deletable && !msg.pinned}).forEach((msg)=>{await msg.delete()})
    }else{
       throw new Error(`Channel ${channel.name} not text channel`)
    }
}