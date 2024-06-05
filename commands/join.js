const { SlashCommandBuilder, Client } = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice')
const { exec } = require("child_process");
const youtubesearchapi = require("youtube-search-api");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('join the voice channel')
	        .addStringOption(option =>
		        option.setName('video')
                                .setRequired(true)
			        .setDescription('the video to be searched')),

	async execute(interaction) {
        if(!interaction.member.voice.channel){
                interaction.reply('please join a channel first')
                return
        }
        // const player = createAudioPlayer();
        // const resource = createAudioResource('./test.mp3');
        // const connection = joinVoiceChannel({
        //     channelId: interaction.member.voice.channel.id,
        //     guildId: interaction.member.voice.channel.guild.id,
	//         adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
        // });
        // player.play(resource);
        // connection.subscribe(player);
        // console.log(`playing sound by ${interaction.member.user.username}`)
        console.log(interaction.options.data[0].value)
        try{
        var result = await youtubesearchapi.GetListByKeyword(interaction.options.data[0].value,false,1,[{type:"video"}])
        } catch(err){
                console.log("failed to get video")
                console.error(err)
        }
        // exec(`yt-dlp -x result.items[0].id`, (error, stdout, stderr) => {
        //         if (error) {
        //             console.log(`error: ${error.message}`);
        //             return;
        //         }
        //         if (stderr) {
        //             console.log(`stderr: ${stderr}`);
        //             return;
        //         }
        //         console.log(`stdout: ${stdout}`);
        //     });
        console.log(`playing ${result.items[0].title} by ${result.items[0].channelTitle}`)
        interaction.reply(`playing ${result.items[0].title} by ${result.items[0].channelTitle}`)
	}
}