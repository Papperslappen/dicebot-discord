const config = require('../config.js');
const storage = require('node-persist');
const commando = require('discord.js-commando');

//TODO: Fix with config
const DM_ROLE_NAME = "spelledare"
const DM_PREFIX = "sl"

function init(client){
	storage.init().then(()=>{
		client.registry.registerGroup('gm_channel')
			.registerCommand(CreateGMChannel)
			.registerCommand(SetGMChannelCategory)
	});
}

module.exports.init = init;


class SetGMChannelCategory extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'gm_channel_category',
			group: 'gm_channel',
			memberName: 'gm_channel_category',
			description: 'category id',
            details: `
            Anv: !textkanal <namn>`
			,
			args: [
				{
					key: 'id',
					label: 'id',
					prompt: 'which id?',
					type: 'string',
				}
			]
		});
  }
  hasPermission(msg){
    return msg.member.hasPermission('ADMINISTRATOR');
  }
  async run(msg,args){
		try {
		await storage.setItem("gm_channel_category_id",args.id);
    }catch(error){
			console.error(error)
    }
  }

}

class CreateGMChannel extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'textkanal',
			group: 'gm_channel',
			memberName: 'textkanal',
			description: 'skapa textkanaler för spelledare',
            details: `
            Anv: !textkanal <namn>`
			,
			guildOnly: true,
			args: [
				{
					key: 'namn',
					label: 'namn',
					prompt: 'vad ska kanalen heta?',
          min: 1,
          max: 32,
					type: 'string',
				}
			]
		});
  }
  hasPermission(msg){
    return msg.member.hasPermission('ADMINISTRATOR') ||
			msg.member.roles.some((role) => role.name === DM_ROLE_NAME);
  }
  async run(msg,args){
		let category_id = await storage.getItem("gm_channel_category_id");
    try {
				let channel = await msg.guild.createChannel(`${DM_PREFIX}-${args.namn}`,{
						type: "text",
						parent: category_id,
						reason: `Skapade kanal på begäran av (${msg.author.tag})`
					}
				);
    }catch(error){
			console.error(error)
    }
  }

}
