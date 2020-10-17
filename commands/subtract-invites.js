const Discord = require('discord.js');
const Enmap = require("enmap");
const defaultSettings = require('../user_config.json');
module.exports = {
	name: 'subtract-invites',
	usage: '<user-mention> <type> <number>',
	description: 'Subtract invites from user invites.',
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
    if (!message.mentions.users.size) {
         return message.reply("Incorrent usage !\nCorrect usage: !add-invites <user-mention> <type> <number>");
	  } else {
         const user = client.settings.ensure(message.guild.id+"_"+message.mentions.users.first().id, defaultSettings);
         member = message.mentions.users.first();
         var [user_mention, type, number] = args;
         if(!type) {
           return message.reply("Incorrent usage !\nCorrect usage: !add-invites <user-mention> <type> <number>");
         }
          else if(!number){
           return message.reply("Incorrent usage !\nCorrect usage: !add-invites <user-mention> <type> <number>");
         }
         else{
           if(type == "regular"){
              type = "invites";
           }

           if(!client.settings.has(message.guild.id+"_"+member.id, type)) {
    	      return message.reply("Incorrent type\nSupported invnite types: \`regular\`, \`leaves\` , \`bonus\`");
    	    }

          if(type == "invites"){
              number = parseInt(user.invites,10)-parseInt(number,10);
          } else if (type == "leaves") {
              number = parseInt(user.leaves,10)-parseInt(number,10);
          } else if (type == "bonus") {
              number = parseInt(user.bonus,10)-parseInt(number,10);
          } else {
              return message.reply("Incorrent type\nSupported invnite types: \`regular\`, \`leaves\` , \`bonus\`");
          }

           //const embed = new Discord.MessageEmbed()
       		 //   .setColor("#a75ff5")
           //  .setTitle(message.mentions.users.first().username)
       		 //   .addField(`${message.mentions.users.first().username} has ${user.invites} Invites :clap:`, `:white_check_mark: ${user.invites} Regular\n:sparkles: ${user.bonus} Bonus\n:x: ${user.leaves} Leaves `)
          //  .setFooter(client.user.username , client.user.displayURL)
            //  .setTimestamp();
           //return message.reply({ embed: embed});
           client.settings.set(message.guild.id+"_"+member.id, number, type);
           message.channel.send(`${member.username}\'s \`${type}\` has been changed to:\n\`${number}\``);

         }
	  }
	},
};
