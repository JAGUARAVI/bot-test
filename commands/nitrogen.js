//var randomstring = require("randomstring");

module.exports = {
	name: 'nitrogen',
	description: 'Under Maintenence',
	usage: '',
	cooldown: 5,
	show: true,
	args: false,
	delete: true,
	execute(message,args,client) {
		message.channel.send("Command Under Maintenence").then(msg => msg.delete({timeout: 10000}));
	},
};
