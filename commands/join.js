const { SlashCommandBuilder, Client } = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('join the voice channel'),
	
	async execute(interaction) {
        const player = createAudioPlayer();
        const resource = createAudioResource('./test.mp3');
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.member.voice.channel.guild.id,
	        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
        });
        player.play(resource);
        connection.subscribe(player);

	}
}