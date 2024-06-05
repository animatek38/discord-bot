const { SlashCommandBuilder, Client } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('disconnect from the channel'),
	
	async execute(interaction) {

	}
}