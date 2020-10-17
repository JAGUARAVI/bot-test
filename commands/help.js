const Discord = require('discord.js');
const Enmap = require("enmap");
const defaultSettings = require('../default.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '<command name>',
	cooldown: 5,
	delete:true,
	execute(message, args, client) {
		if(message.guild){
			client.settings = new Enmap({
			  name: "settings",
			  fetchAll: false,
			  autoFetch: true,
			  cloneLevel: 'deep'
			});
			const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
			var prefix = guildConf.prefix;
		} else {
			var prefix = '!';
		}

		const data = [];
		const { commands } = message.client;
		if (!args.length) {
			const helpEmbed = {
			    color: '#0099ff',
			    author: {
			      name: client.user.username,
			      icon_url: client.user.avatarURL()
			    },
			    title: "Here\'s a list of all my commands:",
			    description: "Commands Help.",
			    fields: [
			    	commands.filter(command => {
						  if (command.show == false) {
						    return false;
						  }
						  return true;
						}).map(command => {
			    		if(command.show == false){return;}
			        	return { name: `\`${prefix+command.name}\`` , value: `Description: ${command.description}\nUsage: \`${prefix+command.name} ${command.usage}\`` } ; 
			      	})
			    ],
			    timestamp: new Date(),
			    footer: {
			      icon_url: client.user.avatarURL(),
			      text: "Made with love by <Anonymous hehe>"
			    }
			  }
			return message.author.send({ embed: helpEmbed })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}



		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}
		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};
