const { SlashCommandBuilder, Client } = require('discord.js');
const joinShit = require('./join.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skip the current song'),

	execute(interaction) {
        if(global.queue.length == 0){
            interaction.reply('no song playing')
            return
        }
        if(!interaction.member.voice.channel){
            interaction.reply('please join a channel first')
            return
        }

        
		global.queue.shift()
		joinShit.playNext()
        interaction.reply('skipped')
    }
}