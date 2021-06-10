const { Message } = require("discord.js");
const ayarlar = require('../../ayarlar.json')


module.exports = async (message) => {
	let client = message.client;
	if (message.author.bot) return;
	if (!message.content.startsWith(ayarlar.prefix)) return;
	let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
	let params = message.content.split(' ').slice(1);
	let perms = elevation(message);
	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
	if (cmd) {
		
		
		if (perms < cmd.conf.permLevel) return;
		cmd.run(client, message, params, perms);
	}
};

function elevation(message) {
	if (!message.guild) return;
	let permlvl = 0;
	if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
	if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
	return permlvl;
};
