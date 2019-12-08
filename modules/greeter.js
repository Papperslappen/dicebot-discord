const config = require('../config.js');
const storage = require('node-persist');
const commando = require('discord.js-commando');

function init(client){
  client.on('guildMemberAdd',(member) => {
    sendGreetingIfActive(member)
    .then(() => console.log(`New member in guild ${member.guild.name} : ${member.user.username}`))
    .catch(console.error);
  });
  storage.init()
    .then(()=>{
    client.registry
              .registerGroup('greeter')
              .registerCommand(Greeting)
              .registerCommand(Greeter)
              .registerCommand(TestGreeting)
            }
          );
}

async function sendGreetingIfActive(member){
  if(await storage.getItem("greeter_on")){
    const channel = await member.guild.channels.find(ch => ch.name === 'bot');
    const message = await storage.getItem("greeter_message");
    const dmChannel = await member.createDM()
    if(dmChannel){
      await dmChannel.send(message);
      if(channel){
        await channel.send(`${member.displayName} gick just med och fick en hälsning skickad`);
      }
    }
  }
}

class Greeting extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'greeting_message',
			aliases: ['hälsning'],
			group: 'greeter',
			memberName: 'greeting',
			description: 'Ställ in en hälsning till nya medlemmar',
            details: `
            Anv: !hälsa <meddelande>, lämna meddelande tomt för att stänga av hälsningar`
			,
			args: [
				{
					key: 'message',
					label: 'message',
					prompt: 'vad vill du skicka till nya medlemmar?',
					type: 'string',
				}
			]
		});
  }
  hasPermission(msg){
    return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
  }
  async run(msg,args){
    try{
      if(args["message"]){
        console.log(`Set greeting message to ${args["message"]}`);
        await storage.setItem('greeter_message',args["message"]);
        msg.reply(`Hälsning ställd till ${args["message"]}`);
      }
    }catch(error){
      console.error(error);
    }
  }

}

class Greeter extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'greeter',
			aliases: ['hälsare'],
			group: 'greeter',
			memberName: 'greeter',
			description: 'Sätt på/stäng av hälsningar till nya medlemmar',
            details: `
            Anv: !hälsare <på/av>`
			,
			args: [
				{
					key: 'onoff',
					label: 'på eller av',
					prompt: 'på eller av',
					type: 'string',
          validate: arg => arg === "på" || arg === "av" || arg === "on" || arg === "off",
				}
			]
		});
  }
  hasPermission(msg){
    return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
  }
  async run(msg,args){
    try{
      if(args["onoff"] === "på" || args["onoff"] === "on"){
        console.log(`turning on greetings`);
        await storage.setItem('greeter_on',true);
        await msg.reply('Hälsningar på')
      }else if(args["onoff"] == "av" || args["onoff"] === "off"){
        console.log(`turning on greetings`);
        await storage.setItem('greeter_on',false);
        await msg.reply('Hälsningar av');
      }
    }catch(error){
      console.error(error);
    }
  }
}


class TestGreeting extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'test_greeting',
			group: 'greeter',
			memberName: 'test_greeting',
			description: '',
            details: `
            Anv: !test_greeting`
			,
		  });
  }
  hasPermission(msg){
    return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
  }
  async run(msg,args){
    try{
      console.log(`testing greeting`);
      await sendGreetingIfActive(msg.member);
    }catch(error){
      console.error(error)
    }
  }

}

module.exports.init = init;
