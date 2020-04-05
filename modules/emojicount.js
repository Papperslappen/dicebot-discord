const commando = require('discord.js-commando');

function init(client){
	client.registry.registerGroup('emojicount')
		.registerCommand(GetEmojis)
}

module.exports.init = init;


class GetEmojis extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'getemojis',
			aliases: ['emojiräkning'],
			group: 'emojicount',
			memberName: 'emojicount',
			description: 'Visar en lista på alla som har satt en emoji på en post',
            details: `
            Anv: !emojiräkning <msgid> där msgid är meddelandets id`
			,
			args: [
				{
					key: 'id',
					label: 'id',
					prompt: 'vilket meddelande vill du räkna emojis på?',
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
      const id = args["id"];
      const emojimsg = await msg.channel.fetchMessage(id);
      const reactions = await emojimsg.reactions;
      var users = [];
      for (const r of reactions.array()){
        const emojiusers = await r.fetchUsers();
        const usernames = emojiusers.array().map((u)=>{return u.tag});
        console.log(`reaction: ${r.emoji.name}, users: ${usernames.length},${usernames}`);
        users.push(usernames);
      }
      const list = Array.from(new Set(users.flat()));
      if(list){
        await msg.author.send("Alla som satt emoji: "+list.join(", "));
      }

    }catch(error){
      console.error(error);
    }
    finally{
      await msg.delete();
    }
  }
}
