const { SlashCommandBuilder, Client } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('list the current queue'),

	execute(interaction) {
        let output = '';
        if(global.queue.length == 0){
            interaction.reply('no song playing')
            return
        }

        global.queue.forEach(e => {
            output = output + e[1] + `\r\n`
        });
        interaction.reply(output)
    }
}