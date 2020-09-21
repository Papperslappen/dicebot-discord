const commando = require('discord.js-commando');
const config = require('./config');

const client = new commando.Client({
    owner: config.discord.bot_owner,
    commandPrefix: config.discord.prefix,
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
        console.log(`Connected to guilds [${client.guilds.map(v => { return v.name })}]`);
    })
    .on('rateLimit', (rateLimitInfo) => {
        console.log(`WARNING! Rate limit Path: ${rateLimitInfo.path}`);
    });
client.registry.registerDefaults();

require('./modules/dicebot').init(client);
require('./modules/autopurge').init(client);
//require('./modules/greeter').init(client);
require('./modules/gm_channel').init(client);
require('./modules/emojicount').init(client);

function main() {
    console.log("Starting Bot");
    if (!config.discord.login_token) {
        console.log("login token not set");
        process.exit(1);
    }
    console.log("Logging in");
    client.login(config.discord.login_token);
}

main();
