require('dotenv').config();
var config = {};
config.discord = {};
config.dicebot = {};

config.discord.login_token = process.env.DISCORD_LOGIN_TOKEN || "";
config.discord.bot_owner = process.env.DISCORD_BOT_OWNER_ID || "";
config.discord.prefix = process.env.DISCORD_BOT_COMMAND_PREFIX  || "";
config.discord.confmode = process.env.DISCORD_BOT_CONF_MODE || "";

config.dicebot.url = process.env.DICEBOT_URL || "127.0.0.1";
config.dicebot.port = process.env.DICEBOT_PORT || "6810";

module.exports = config;
