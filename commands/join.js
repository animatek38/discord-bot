const { SlashCommandBuilder, Client } = require('discord.js');
const {joinVoiceChannel, createAudioResource, getVoiceConnection  } = require('@discordjs/voice')
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


        async function download(vidId, name) {
                interaction.editReply(`downloading`)
                try {
                        const {stdout, stderr} = await execPromise(`yt-dlp -P audio -o ${vidId} -x --audio-format opus ${vidId}`)
                } catch (err) {
                        console.error('error downloading video')
                        console.error(err);
                        interaction.editReply("there was a problem downloading the audio please try again")
                        return
                }

                console.log('finished downloading')
                startPlaying(vidId, name)
        }

        async function search(arg){
                await interaction.deferReply();
                try {
                        var result = await youtubesearchapi.GetListByKeyword(arg,false,1,[{type:"video/playlist"}])
                } catch (error) {
                        console.log('error when searching for video')
                        console.error(error)
                        console.error(result)
                        return
                }
                if(result.items.length < 1){
                        interaction.editReply("error getting the video, please use the name of the video instead")
                        console.warn(`error getting ${arg}`)
                        console.warn(result)
                        return
                }
                if(result.items[0].type!="video"){
                        interaction.editReply("didn't find a video please use URL")
                        return
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
                                download(result.items[0].id, result.items[0].title)
                        } else {
                                startPlaying(result.items[0].id, result.items[0].title)
                        }
                      });
        }
        search(interaction.options.data[0].value)
        
        function startPlaying(id, name) {
                addToQueue(id,name )
                if(global.queue.length == 1){
                interaction.editReply(`playing ${name}`)
                const resource = createAudioResource(`./audio/${id}.opus`,{ inlineVolume: true });
                const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.voice.channel.guild.id,
                        adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                });
                global.player.play(resource);
                connection.subscribe(global.player);
                }else{
                        interaction.editReply('added to queue')
                }
        }




        //functions that take care of the queue
        function addToQueue(id, name) {
                global.queue.push([id, name])
        }
        
        function readQueue(params) {
                console.log(global.queue);
        }
        
        function removeFromQueue() {
                global.queue.shift()
        }

        console.log(`playing sound by ${interaction.member.user.username}`)
	},
        playNext(){
		console.log('playing next');
                const resource = createAudioResource(`./audio/${global.queue[0][0]}.opus`,{ inlineVolume: true });
                // const connection = joinVoiceChannel({
                // channelId: interaction.member.voice.channel.id,
                // guildId: interaction.member.voice.channel.guild.id,
                //         adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
                // });
                const connection = getVoiceConnection('651120444237152266');
                console.log(connection);
                global.player.play(resource);
                connection.subscribe(global.player);
        }
}