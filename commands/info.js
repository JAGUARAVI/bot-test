module.exports = {
	name: 'info',
	usage: '',
	description: 'Display info about yourself or mentioned user.',
	execute(message) {
		if (!message.mentions.users.size) {
	    	return message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}\nAccount created at: ${message.author.createdAt}`);
	    }
	    else{
	    	let member = message.mentions.members.first();
	    	return message.channel.send(`Username: ${member.user.username}\nID: ${member.user.id}\nAccount created at: ${member.user.createdAt}`);
	    }
	},
};
