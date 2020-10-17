module.exports = {
	name: 'ping',
	description: 'Displays Bot Latency',
	usage: '',
	cooldown: 3,
	show: true,
	args: false,
	execute(message,args,client) {
		var yourping = new Date().getTime() - message.createdTimestamp
		var botping = Math.round(client.ws.ping)
		message.channel.send(`Your Ping ${yourping} ms \nBots ping: ${botping} ms`);
	},
};
