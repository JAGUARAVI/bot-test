const Enmap = require("enmap");
const defaultSettings = require('../default.json');
module.exports = {
	name: 'set-config',
	description: 'Configure Bot',
	aliases: ['setup'],
	cooldown: 3,
	show: true,
	args: true,
	guildOnly: true,
	usage: '<key> <value>',
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
		const [prop, ...value] = args;

		if(!client.settings.has(message.guild.id, prop)) {
	      return message.reply("This key is not in the configuration.");
	    }

	    client.settings.set(message.guild.id, value.join(" "), prop);

	    message.channel.send(`Guild configuration item \`${prop}\` has been changed to:\n\`${value.join(" ")}\``);
	},
};
