const Discord = require('discord.js');
const Enmap = require("enmap");
const defaultSettings = require('../user_config.json');
module.exports = {
	name: 'clear-invites',
	usage: '<user-mention>',
	description: 'Clear user invites.',
  args: true,
	execute(message, args, client) {
    client.settings = new Enmap({
		  name: "settings",
		  fetchAll: false,
		  autoFetch: true,
		  cloneLevel: 'deep'
		});
    if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply("You're not an admin, sorry!");
		}
    if(args[0] == 'all'){
      message.guild.members.cache.map(user => {
        client.settings.delete(message.guild.id+"_"+user.id);
      });
      return message.channel.send(`All invites were cleared`);
    }
    else if (!message.mentions.users.size) {
         return message.reply("Incorrent usage !\nCorrect usage: !set-invites <user-mention>");
	  } else {
         const user = client.settings.ensure(message.guild.id+"_"+message.mentions.users.first().id, defaultSettings);
         member = message.mentions.users.first();
         var [user_mention, type, number] = args;
         client.settings.set(message.guild.id+"_"+member.id, 0, 'invites');
         client.settings.set(message.guild.id+"_"+member.id, 0, 'bonus');
         client.settings.set(message.guild.id+"_"+member.id, 0, 'leaves');
         message.channel.send(`${member.username}\'s all invites were cleared`);

	  }
	},
};
