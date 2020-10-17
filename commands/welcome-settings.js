const Enmap = require("enmap");
const welcomeSettings = require('../welcome_default.json');
const defaultSettings = require('../default.json'); 	
module.exports = {
	name: 'welcome-settings',
	description: 'Configure Welcome Messages',
	aliases: ['welcome-config'],
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
		const welcomeConf = client.settings.ensure(`${message.guild.id}-welcome`, welcomeSettings);
		const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
		var prefix = guildConf.prefix;

		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply("You're not an admin, sorry!");
		}

		var msg = message.content;
        if(!args || args.length <= 1) {
        	let configProps = Object.keys(welcomeConf).map(prop => {
		    	return `${prop}  :  ${welcomeConf[prop]}`;
		    });
		    message.channel.send(`The following are the welcome module's current configuration:\`\`\`${configProps.join("\n")}\`\`\`\nIf you want to change any setting type - \`${prefix}welcome-settings <key> <value>\``);
        } else {
        	const [prop, ...value] = args;

			if(!client.settings.has(`${message.guild.id}-welcome`, prop)) {
		      return message.reply("This key is not in the configuration.");
		    }

		    client.settings.set(`${message.guild.id}-welcome`, value.join(" "), prop);

		    message.channel.send(`Welcome message configuration item \`${prop}\` has been changed to:\n\`${value.join(" ")}\``);
        }
	},
};
