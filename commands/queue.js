const { SlashCommandBuilder, Client } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('list the current queue'),

	execute(interaction) {
        interaction.deferReply()
        let output = '';
        if(global.queue.length == 0){
            interaction.editReply('no song playing')
            return
        }

        global.queue.forEach(e => {
            output = output + output
        });
    }
}