const Discord = require('discord.js');
const Enmap = require("enmap");
const defaultSettings = require('../user_config.json');
module.exports = {
	name: 'invites',
	usage: '<user-mention>',
	description: 'Display user invites.',
  args: false,
	execute(message, args, client) {
    client.settings = new Enmap({
		  name: "settings",
		  fetchAll: false,
		  autoFetch: true,
		  cloneLevel: 'deep'
		});
    if (!message.mentions.users.size) {
         const user = client.settings.ensure(message.guild.id+"_"+message.author.id, defaultSettings);
         const embed = new Discord.MessageEmbed()
     		    .setColor("#a75ff5")
            .setTitle(message.author.username)
     		    .addField(`You have ${user.invites+user.bonus-user.leaves} Invites :clap:`, `:white_check_mark: ${user.invites} Regular\n:sparkles: ${user.bonus} Bonus\n:x: ${user.leaves} Leaves `)
            .setFooter(client.user.username , client.user.displayURL)
            .setTimestamp();
         return message.reply({ embed: embed});
	  } else {
         const user = client.settings.ensure(message.guild.id+"_"+message.mentions.users.first().id, defaultSettings);
         const embed = new Discord.MessageEmbed()
     		    .setColor("#a75ff5")
            .setTitle(message.mentions.users.first().username)
     		    .addField(`${message.mentions.users.first().username} has ${user.invites+user.bonus-user.leaves} Invites :clap:`, `:white_check_mark: ${user.invites} Regular\n:sparkles: ${user.bonus} Bonus\n:x: ${user.leaves} Leaves `)
            .setFooter(client.user.username , client.user.displayURL)
            .setTimestamp();
         return message.reply({ embed: embed});
	  }
	},
};
