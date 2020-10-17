module.exports = {
	name: 'features',
	description: 'List all the features of the bot',
	usage: '',
	cooldown: 5,
	show: true,
	args: false,
	execute(message,args,client) {
		const featuresEmbed =
	    {
	    	"title": "Features",
	    	"description": `Features of ${client.user.toString()}`,
	    	"color": 16023551,
	    	"author": {
	    		"name": "NitroGen Moderator",
	        	"icon_url": client.user.displayAvatarURL(), 
	      	},
	    	"footer": {
	        	"text": "Made with love by <Anonymous hehe>",
	        	"icon_url": client.user.displayAvatarURL() ,
	      	}
	    }
		return message.channel.send({embed: featuresEmbed});
	},
};
