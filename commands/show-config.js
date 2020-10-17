const Enmap = require("enmap");
const defaultSettings = require('../default.json');
module.exports = {
	name: 'show-config',
	description: 'Show Bot Configuration',
	aliases: ['config'],
	cooldown: 3,
	show: true,
	args: false,
	guildOnly: true,
	usage: '',
	execute(message,args,client) {

		client.settings = new Enmap({
		  name: "settings",
		  fetchAll: false,
		  autoFetch: true,
		  cloneLevel: 'deep'
		});
		const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
		var prefix = guildConf.prefix;

		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply("You're not an admin, sorry!");
		}
		let configProps = Object.keys(guildConf).map(prop => {
	      return `${prop}  :  ${guildConf[prop]}`;
	    });
	    message.channel.send(`The following are the server's current configuration:
	    \`\`\`${configProps.join("\n")}\`\`\``);
		},
};
