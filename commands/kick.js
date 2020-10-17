const Discord = require('discord.js');
const Enmap = require("enmap");
const defaultSettings = require('../default.json');
var parseBool = require('parseboolean');
module.exports = {
	name: 'kick',
	description: 'Tag a member and kick them.',
	usage: '<user-to-kick>',
	guildOnly: true,
	cooldown: 3,
	args: false,
	delete: true,
	execute(message, args, client) {
		client.settings = new Enmap({
		  name: "settings",
		  fetchAll: true,
		  autoFetch: true,
		  cloneLevel: 'deep'
		});
		const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
		var prefix = guildConf.prefix;
		if(!message.guild.me.hasPermission("ADMINISTRATOR") && !message.guild.me.hasPermission("KICK_MEMBERS")){
            return message.reply(`I don't have the required permissions to perform this action\nPerms required- \`KICK_MEMBERS\``);
        } else if (!message.mentions.users.size) {
			const error = new Discord.MessageEmbed()
			    .setColor("#ff0000")
			    .addField(":x: Failed !", `Please \`@mention\` a user in order to kick them !`)
	        return message.channel.send({embed: error}).then(msg => msg.delete({timeout: 10000}));
		} else if(parseBool(guildConf.moderation) == false){ 
			const error = new Discord.MessageEmbed()
			    .setColor("#ff0000")
			    .addField(":x: Failed !", `Please enable \*\*\*moderation\*\*\* module in order to \*\*\*kick\*\*\* someone !`)
			    .addField(":point_down: To enable \*\*\*moderation\*\*\*", `type: \`${prefix}set-config moderation true\``);
	        return message.channel.send({embed: error}).then(msg => msg.delete({timeout: 10000}));
		} else {
			let member = message.mentions.members.first();
			member.kick().then((member) => {
				const embed = new Discord.MessageEmbed()
		       	.setColor("#34eb5b")
		        .addField(":white_check_mark: Success !", `Successfully kicked ${member.user}`)
		       	.addField(":wave: Bye !", `Moderator: ${message.author}`);
		       	return message.channel.send({embed: embed});
			}).catch(() => {
				if (!message.member.hasPermission(['KICK_MEMBERS', 'ADMINISTRATOR'])) {
					const error = new Discord.MessageEmbed()
			        	.setColor("#ff0000")
			            .addField(":x: Failed !", `You cannot kick members ${message.author} !`);
		       		return message.channel.send({embed: error}).then(msg => msg.delete({timeout: 10000}));
				} else if (member.user.id == message.author.id){
					const error = new Discord.MessageEmbed()
			        	.setColor("#ff0000")
			            .addField(":x: Failed !", `You cannot kick yourself ${message.author} !`);
		       		return message.channel.send({embed: error}).then(msg => msg.delete({timeout: 10000}));
				} else if (member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR'])) {
					const error = new Discord.MessageEmbed()
			        	.setColor("#ff0000")
			            .addField(":x: Failed !", `You cannot kick this member ${message.author} !`);
		       		return message.channel.send({embed: error}).then(msg => msg.delete({timeout: 10000}));
				}
			});
		}
	},
};
