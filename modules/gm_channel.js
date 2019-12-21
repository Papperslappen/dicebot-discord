const config = require('../config.js');
const storage = require('node-persist');
const commando = require('discord.js-commando');

//TODO: Fix with configuration/persist
const DM_PREFIX = "sl"
//Find a better way to do this
var gm_role = "spelledare"
function init(client){
	storage.init().then(()=>{
		storage.getItem("gm_channel_role").then((role)=>gm_role = role);
		client.registry.registerGroup('gm_channel')
			.registerCommand(CreateGMChannel)
			.registerCommand(SetGMChannelCategory)
			.registerCommand(SetGMRole)
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
            Anv: !gm_channel_category <id>`
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

class SetGMRole extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'gm_role',
			group: 'gm_channel',
			memberName: 'gm_role',
			description: 'gm role',
            details: `
            Anv: !gm_role <role/name>`
			,
			args: [
				{
					key: 'name',
					label: 'name',
					prompt: 'which name or role?',
					type: 'string',
				}
			]
		});
  }
  hasPermission(msg){
    return msg.member.hasPermission('ADMINISTRATOR');
  }
  async run(msg,args){
		var name = args.name;

		if(msg.mentions.roles.length > 0){
			 name = msg.mentions.roles.first().name;
		}
		console.log(`set gm_role_id to ${name}`);
		try {
		await storage.setItem("gm_channel_role",name);
		gm_role = name;
    }catch(error){
			console.error(error);
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
		return msg.member.roles.some((role)=>role.name === gm_role);
  }
  async run(msg,args){
		let category_id = await storage.getItem("gm_channel_category_id");
		//let role = await storage.getItem("gm_channel_role");
		let channel_name = `${DM_PREFIX}-${args.namn}`;
    try {
				let channel = await msg.guild.createChannel(channel_name,{
						type: "text",
						parent: category_id,
						reason: `Skapade kanal på begäran av ${msg.author.displayName} (${msg.author.tag})`
					});
					msg.reply(`Skapade kanalen ${channel.toString()}! Mycket nöje`);
					console.log(`Created channel ${channel.toString()}!`)
    }catch(error){
			console.error(error)
    }
  }

}
