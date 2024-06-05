const { SlashCommandBuilder, Client } = require('discord.js');
const {joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice')
const { exec } = require("child_process");
const youtubesearchapi = require("youtube-search-api");
const fs = require('fs')
const  util  = require("util")
const execPromise = util.promisify(exec);
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('join the voice channel')
	        .addStringOption(option =>
		        option.setName('video')
                                .setRequired(true)
			        .setDescription('the video to be searched')),

	execute(interaction) {
        if(!interaction.member.voice.channel){
                interaction.reply('please join a channel first')
                return
        }
        
        interaction.deferReply();


        async function download(vidId) {
                interaction.editReply(`downloading`)
                try {
                        const {stdout, stderr} = await execPromise(`yt-dlp -P audio -o ${vidId} -x ${vidId}`)
                } catch (err) {
                        console.log('error downloading video')
                        console.error(err);
                }

                console.log('finished downloading')
                startPlaying(vidId)
        }

        async function search(arg){
                try {
                        var result = await youtubesearchapi.GetListByKeyword(arg,false,1,[{type:"video"}])
                } catch (error) {
                        console.log('error when searching for video')
                        console.error(error)
                }
                if(result.items[0].islive){
                        interaction.editReply('failed to acquire video')
                        return
                }

                //check that the video is under 10min


                function hmsToSecondsOnly(str) {
                        var p = str.split(':'),
                            s = 0, m = 1;
                    
                        while (p.length > 0) {
                            s += m * parseInt(p.pop(), 10);
                            m *= 60;
                        }
                    
                        return s;
                    }
                    vidLength = hmsToSecondsOnly(result.items[0].length.simpleText)
                if(vidLength > 600){
                        interaction.editReply('video too long')
                        return
                }



                console.log(`playing ${result.items[0].title} by ${result.items[0].channelTitle}`)
                fs.access(`./audio/${result.items[0].id}.opus`, fs.constants.F_OK, (err) => {
                        if(err){
                                console.log(`downloading video ${result.items[0].title}`)
                                download(result.items[0].id)
                        } else {
                                startPlaying(result.items[0].id)
                        }
                      });
        }
        search(interaction.options.data[0].value)
        
        function startPlaying(id) {
                interaction.editReply(`playing`)
                const player = createAudioPlayer();
                const resource = createAudioResource(`./audio/${id}.opus`,{ inlineVolume: true });
                resource.volume.setVolume(0.1);
                const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.voice.channel.guild.id,
                        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                });
                player.play(resource);
                connection.subscribe(player);
        }




        console.log(`playing sound by ${interaction.member.user.username}`)
	}
}