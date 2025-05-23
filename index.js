const { Client, GatewayIntentBits, Collection, Routes, SlashCommandBuilder, Application } = require('discord.js');
const fs = require('fs')
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions
    ]
});
const token = process.env.TOKEN
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(token);
var commands = new Collection()
var commandThatWillBeAdded = new Collection()
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'))
const { OpusEncoder } = require('@discordjs/opus');
const { generateDependencyReport, createAudioPlayer } = require('@discordjs/voice');
const encoder = new OpusEncoder(48000, 2);

try {
	global.queue = []
	global.player = createAudioPlayer();
} catch (error) {
	console.error('failed to create audio player')
	console.error(error)
}

// liste les commandes

for (const file of commandFiles) {
	try{
	const command = require(`./commands/${file}`)
	commands.set(command.data.name, {data: command.data, execute: command.execute})
	} catch(error){
		console.error(error)
	}
}





client.once('ready', () => {
	console.log(`you can invite the bot with this link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=8`);
	console.log(`Ready under the name of ${client.user.username}`);

	// update command
	client.guilds.cache.forEach(i => {
		updateCommand(client.user.id, i.id)	
	});
	console.log("finished updating command");
});


try{
	client.login(token)
}catch(error){
	console.error(error);
	process.exit(1);
}

client.on('interactionCreate', async interaction => {
	if (interaction.isModalSubmit() || interaction.isButton()) {
		try {
			commands.get(interaction.customId).execute(interaction)
		} catch (error) {console.error(error)}
	}
	else {
		try {
			commands.get(interaction.commandName).execute(interaction)
		} catch (error) {console.error(error)}
	}
})


//met a jour les commandes dans un server
function updateCommand(clientId, serverId) {
	rest.put(Routes.applicationCommands(clientId), { body: [] })
	.catch(console.error);

	for (const file of commandFiles) {
		const command = require(__dirname + `/commands/${file}`)
		commandThatWillBeAdded.set(command.data.name, command.data)
	}
	commandThatWillBeAdded.map(command => command.toJSON());
	rest.put(Routes.applicationGuildCommands(clientId, serverId), { body: commandThatWillBeAdded })
	.catch(console.error);
};


const joinShit = require('./commands/join.js')
const AudioPlayerStatus  = require('@discordjs/voice')
player.on('stateChange', (oldState, newState) => {
	if(newState.status == 'idle'){
		global.queue.shift()
		if (global.queue.length!=0) {
			console.log('playing next');
			joinShit.playNext()
		}
	}
});
