const Client = require('discord.js-commando').Client;
//import { Client } from 'discord.js';
const discord = require('./config').discord;

const client = new Client({
    owner: discord.bot_owner,
    commandPrefix: discord.prefix,
    unknownCommandResponse: false,
});

client
    .on('error',console.error)
    .on('warn',console.warn)
//    .on('debug', console.log)
    .on('disconnect', () => { console.warn('Disconnected!'); })
	  .on('reconnecting', () => { console.warn('Reconnecting...'); })
    .on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`Connected to guilds [${client.guilds.cache.map(v => { return v.name })}]`);
    })
    .on('rateLimit', (rateLimitInfo) => {
        console.log(`WARNING! Rate limit Path: ${rateLimitInfo.path}`);
    });

client.registry.registerDefaults();

require('./modules/dicebot').init(client);
//require('./modules/autopurge').init(client);
//require('./modules/greeter').init(client);
require('./modules/gm_channel').init(client);
//require('./modules/emojicount').init(client);

function main() {
    console.log("Starting Bot");
    if (!discord.login_token) {
        console.log("login token not set");
        process.exit(1);
    }
    console.log("Logging in");
    client.login(discord.login_token);
}

main();
