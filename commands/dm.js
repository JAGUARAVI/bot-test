module.exports = {
	name: `dm`,
    description: 'Sends message provided to mentioned member',
    usage: `<person-to-dm>`,
    args: true,
    guildOnly: true,
    show: false,
    delete: true,
	async execute(message,args) {
        var msg = message.content;
        if (!message.mentions.users.size) {
          return message.reply('you need to tag a user in order to dm them!').then(msg => msg.delete({timeout:5000}));
        }
        else {
            try {
                msg = msg.substring(msg.indexOf("dm") + 2);
            } catch(error) {
                console.log(error);
                return;
            }

            if(!msg || msg.length <= 1) {
                const embed = new Discord.RichEmbed()
                    .addField(":x: Failed to send", "Message not specified")
                    .addField(":eyes: Listen up!", "Every character past the command will be sent,\nand apparently there was nothing to send.");
                message.channel.send({ embed: embed });
                return;
            }
            let member = message.mentions.members.first();
            member.user.send(msg);
        }
    },
};