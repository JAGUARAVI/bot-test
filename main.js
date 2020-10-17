const fs = require('fs');
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const { token, status, game, status_text} = require('./config.json');
const profanity = require('./words.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var parseBool = require('parseboolean');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();
var prefix = '!';

//*************************************************************************************
//*********************************DISCORD CONFIGURATION*******************************
//*************************************************************************************

const Enmap = require("enmap");

client.settings = new Enmap({
  name: "settings",
  fetchAll: true,
  autoFetch: true,
  cloneLevel: 'deep'
});

const defaultSettings = require('./default.json'); 				//load default configuration 
const welcomeSettings = require('./welcome_default.json');		//load default welcome
const user_settings = require('./user_config.json');

const wait = require('util').promisify(setTimeout);
const invites = {};

/************************************FOR INTERNAL COMMANDS*****************************

		const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
		const guildConfwelcome = client.settings.ensure(`${message.guild.id}-welcome`, welcomeSettings);
		var prefix = guildConf.prefix;
		
***********************************FOR INTERNAL COMMANDS******************************/


//*************************************************************************************
//**********************************ENMAP CONFIGURATION********************************
//*************************************************************************************


client.once('ready', async () => { 
	await wait(1000);

	  // Load all invites for all guilds and save them to the cache.
	client.guilds.cache.map(g => {
		g.fetchInvites().then(guildInvites => {
		invites[g.id] = guildInvites;
	 	});
	});
    client.user.setPresence({
        status: status,  // You can show online, idle, invisible, dnd
        activity: {
            name: status_text,
            type: game, // PLAYING, WATCHING, LISTENING, STREAMING,
        }
    }).then(console.log)
  .catch(console.error);
  console.log(`Logged in as ${client.user.tag}!`);
});

//*************************************************************************************
//*************************************CLIENT READY************************************
//*************************************************************************************

client.on('message', async message => {
	if(!message.guild || message.author.bot) {
		var prefix = '!';
	} else {
		const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
		const guildConfwelcome = client.settings.ensure(`${message.guild.id}-welcome`, welcomeSettings);
		var prefix = guildConf.prefix;
	}

	if (!message.content.startsWith(prefix) || message.author.bot){ 

		const blocked = profanity.filter(word => message.content.toLowerCase().includes(word));
		if (blocked.length > 0 && message.author.id != '765950099368837130' && !message.author.hasPermission('ADMINISTRATOR')) {
			message.delete().catch(console.error);
			const Profanity = {
				color: '#ff0000',
				fields: [
					{
						name: `:x: Not Allowed`,
						value: `You can't use that word in this server ${message.author}`,
					},
				],
			};
		    return message.channel.send({embed: Profanity}).then(msg => msg.delete({timeout: 5000}));
		}
		else{
			return;
		}
	}

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command){
		const blocked = profanity.filter(word => message.content.toLowerCase().includes(word));
		if (blocked.length > 0 && message.author.id != '765950099368837130' && !message.author.hasPermission('ADMINISTRATOR')) {
			message.delete().catch(console.error);
			const Profanity = {
				color: '#ff0000',
				fields: [
					{
						name: `:x: Not Allowed`,
						value: `You can't use that word in this server ${message.author}`,
					},
				],
			};
		    return message.channel.send({embed: Profanity}).then(msg => msg.delete({timeout: 5000}));
		}
		else{
			return;
		}
	}

	if(command.delete && message.guild) {
		if(message.guild.me.hasPermission("ADMINISTRATOR") || message.guild.me.hasPermission("MANAGE_MESSAGES")){
			message.delete();
		}
	}

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		if(command.usage){
	        const embed = new Discord.MessageEmbed()
	        	.setColor("#ff0000")
	            .addField(":x: Failed", `${message.author}, you did not provide any arguments !`)
	        	.addField(":eyes: Listen up!", `The proper usage would be: \`${prefix}${command.name} ${command.usage}\``);
	        return message.channel.send({embed: embed}).then(msg => msg.delete({timeout: 10000}));
    	}
    	else{
    		const embed = new Discord.MessageEmbed()
    			.setColor("#ff0000")
	            .addField(":x: Failed", `${message.author}, you did not provide any arguments !`)
	        return message.channel.send({embed: embed}).then(msg => msg.delete({timeout: 10000}));
    	}

	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then(msg => {msg.delete({ timeout: expirationTime - now })}).catch(console.error);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


//*************************************************************************************
//*************************************MESSAGE DONE************************************
//*************************************************************************************


client.on('guildMemberAdd', member => {
	const guildConf = client.settings.ensure(member.guild.id, defaultSettings);
	const guildConfwelcome = client.settings.ensure(`${member.guild.id}-welcome`, welcomeSettings);

  // To compare, we need to load the current invite list.

	 member.guild.fetchInvites().then(guildInvites => {
	    // This is the *existing* invites for the guild.
	    const ei = invites[member.guild.id];
	    // Update the cached invites for the guild.
	    invites[member.guild.id] = guildInvites;
	    // Look through the invites, find the one for which the uses went up.
	    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
	    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
	    const inviter = client.users.cache.get(invite.inviter.id);

			const joiner_config = client.settings.ensure(member.guild.id+"_"+member.user.id, user_settings);
			const inviter_config = client.settings.ensure(member.guild.id+"_"+inviter.id, user_settings);

			var user_invites = inviter_config.invites;
			user_invites++;

			client.settings.set(member.guild.id+"_"+member.user.id, inviter.id, 'invited_by');
			client.settings.set(member.guild.id+"_"+inviter.id, user_invites, 'invites');
	    // Get the log channel (change to your liking)
	    // A real basic message with the information we need.
	    if(parseBool(guildConf.invite_tracking) == true){
	    	const logChannel = member.guild.channels.cache.find(channel => channel.name === "join-logs");
			logChannel.send(`${member.user.toString()} joined, invited by \*\*\*${inviter.username}\*\*\*.\n \*\*\*${inviter.username}\*\*\* has ${inviter_config.invites+inviter_config.bonus-inviter_config.leaves+1} invites`);
		}
	});

	if(parseBool(guildConf.welcome) == false) return;

	var ad_title = guildConfwelcome.advertisement_title;
	var ad_message = guildConfwelcome.advertisement_message.replace("{{link}}", guildConfwelcome.advertisement_link);

	if(parseBool(guildConfwelcome.advertisement) == false){
		ad_title = `Don't forget to vote for us on-`;
		ad_message = `[Top.gg](https://top.gg)`;
	}
	const JoinMessage = {
		color: '#F47FFF',
		title: `Welcome to ${member.guild.name} !`,
		author: {
			name: `${client.user.tag}`,
		},
		description: `Welcome ${member.user.tag} !`,
		thumbnail: {
			url: member.guild.iconURL(),
		},
		fields: [
			{
				name: guildConfwelcome.title,
				value: guildConfwelcome.message.replace("{{user}}", member.user.toString()),
			},
			{
				name: ad_title,
				value: ad_message,
			},
			{
				name: ':tada: To invite me in your server :tada:',
				value: `[Click Here](https://discord.com/api/oauth2/authorize?client_id=765950099368837130&permissions=8&scope=bot)`,
			},
		],
		image: {
			url: guildConfwelcome.image,
		},
		timestamp: new Date(),
		footer: {
			text: 'Made with love by <Anonymous hehe>',
			icon_url: '',
		},
	};
    return member.user.send({embed: JoinMessage});
});


//*************************************************************************************
//***********************************MEMBER JOIN DONE**********************************
//*************************************************************************************


client.on('guildMemberRemove',(member) => {
	const guildConf = client.settings.ensure(member.guild.id, defaultSettings);
	const leaver_config = client.settings.ensure(member.guild.id+"_"+member.user.id, user_settings);

	const inviter = leaver_config.invited_by;
	const inviter_obj = client.users.cache.get(inviter);


	const inviter_config = client.settings.ensure(member.guild.id+"_"+inviter, user_settings);

	var user_invites = inviter_config.invites;
	var user_leaves = inviter_config.invites;
	//user_invites-=1;
	user_leaves-=1;

	client.settings.set(member.guild.id+"_"+inviter, user_invites, 'invites');
	client.settings.set(member.guild.id+"_"+inviter, user_invites, 'leaves');

	if(parseBool(guildConf.invite_tracking) == true){
	   	const logChannel = member.guild.channels.cache.find(channel => channel.name === "join-logs");
		logChannel.send(`${member.user.toString()} left, invited by \*\*\*${inviter_obj.username}\*\*\*.\n \*\*\*${inviter_obj.username}\*\*\* has ${inviter_config.invites+inviter_config.bonus-inviter_config.leaves-1} invites`);
	}
});


//*************************************************************************************
//***********************************MEMBER LEAVE DONE**********************************
//*************************************************************************************


client.on("guildDelete", guild => {
	client.settings.delete(guild.id);
});


//*************************************************************************************
//**************************************DELETE DONE************************************
//*************************************************************************************


client.login(token);