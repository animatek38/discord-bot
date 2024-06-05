const { SlashCommandBuilder, Client, GuildScheduledEventManager } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start-event')
		.setDescription('create and take care of an event for you'),
	
	async execute(interaction) {
		interaction.guild.scheduledEvents
		interaction.reply('test')
	},
}