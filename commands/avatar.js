const Discord = require('discord.js');

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	usage: '<user-mention>',
	cooldown: 5,
	guildOnly: false,
	aliases: ['icon', 'pfp'],
	delete : true,
  args: false,
	execute(message, args) {

		if (!message.mentions.users.size) {
//			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
				const userEmbed = new Discord.MessageEmbed()
					.setTitle(`${message.author.tag}\'s avatar`)
					.attachFiles([{name: `${message.author.id}.png`, attachment: message.author.displayAvatarURL({ dynamic: true, size: 256 })}])
					.setImage(`attachment://${message.author.id}.png`);

				return message.channel.send(userEmbed);

			} else {
				const avatarList = message.mentions.users.map(user => {
		//			return `${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
					const mentionEmbed = new Discord.MessageEmbed()
						.setTitle(`${user.tag}'s avatar`)
						.attachFiles([{name: `${user.id}.png`, attachment: user.displayAvatarURL({ dynamic: true, size: 256 })}])
						.setImage(`attachment://${user.id}.png`);
					return message.channel.send(mentionEmbed);
			});
		}
	},
};
