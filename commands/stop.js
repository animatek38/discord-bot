const { SlashCommandBuilder, Client } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('disconnect from the channel'),
	
	async execute(interaction) {
        if(!interaction.member.voice.channel){
			interaction.reply('please join a channel first')
			return
		}
		const connection = await getVoiceConnection(interaction.guildId);
		connection.destroy();
		global.queue = []
		interaction.reply('left')
	}
}