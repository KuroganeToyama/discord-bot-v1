const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pagination, ButtonTypes, ButtonStyles } = require('@devraelfreeze/discordjs-pagination');
const fetch = require('node-fetch');

// Array of embeds to use for pagination
let embedArr = [];

const sfwList = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 
                'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush',
                'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap',
                'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'];
const nsfwList = ['waifu', 'trap', 'neko'];

// Set up the array of embeds
const len = sfwList.length - 3;
for (let i = 0; i <= len; i += 4) {
    // First page, NSFW tags included
    if (i == 0) {
        let sfwEmbedList = '';
        for (let j = i; j <= i + 3; ++j) {
            sfwEmbedList += `\`${j + 1}\` ${sfwList[j]}\n`;
        }

        let nsfwEmbedList = ''
        nsfwList.forEach((item, index) => {
            nsfwEmbedList += `\`${index + 1}\` ${item}\n`;
        });

        const tagsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('List of tags to use')
            .setTimestamp()
            .addFields({ name: 'SFW', value: sfwEmbedList, inline: true })
            .addFields({ name: 'NSFW', value: nsfwEmbedList, inline: true });

        embedArr.push(tagsEmbed);
    }
    // Last page, only 3 tags instead of 4
    else if (i == len) {
        let sfwEmbedList = '';
        for (let j = i; j <= i + 2; ++j) {
            sfwEmbedList += `\`${j + 1}\` ${sfwList[j]}\n`;
        }

        const tagsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('List of tags to use')
            .setTimestamp()
            .addFields({ name: 'SFW', value: sfwEmbedList });

        embedArr.push(tagsEmbed);
    }
    // Normal pages
    else {
        let sfwEmbedList = '';
        for (let j = i; j <= i + 3; ++j) {
            sfwEmbedList += `\`${j + 1}\` ${sfwList[j]}\n`;
        }

        const tagsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('List of tags to use')
            .setTimestamp()
            .addFields({ name: 'SFW', value: sfwEmbedList });

        embedArr.push(tagsEmbed);
    }
}

// Set up command
module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Random image of anime girls UwU')
        .addSubcommand(subcommand => 
            subcommand.setName('help')
                .setDescription('List all the tags you can use'))
        .addSubcommand(subcommand => 
            subcommand.setName('find')
                .setDescription('Search for kawaii anime girl arts!')
                .addStringOption(option => 
                    option.setName('safe')
                        .setDescription('Choose sfw or nsfw')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('tag')
                        .setDescription('Choose a tag')
                        .setRequired(true))),
    
    async execute(interaction) {
        try {
            if (interaction.options.getSubcommand() === 'find') {
                const root = 'https://api.waifu.pics/';
                const safe = interaction.options.getString('safe');
                const tag = interaction.options.getString('tag');
                const apiCall = root.concat(safe, '/', tag);
                const response = await fetch(apiCall);
                const json = await response.json();
                const image = (safe === 'nsfw') ? (`|| ${json.url} ||`) : (json.url);
                await interaction.editReply(image);
            }
            else if (interaction.options.getSubcommand() === 'help') {
                const channel = interaction.channel;
                await interaction.editReply("Here's your list!");
                //channel.send({ embeds: [tagsEmbed] });
                await pagination({
                    embeds: embedArr, /** Array of embeds objects */
                    author: interaction.member.user,
                    interaction: interaction,
                    ephemeral: true,
                    time: 40000, /** 40 seconds */
                    disableButtons: false, /** Remove buttons after timeout */
                    fastSkip: false,
                    pageTravel: false,
                    buttons: [
                      {
                        type: ButtonTypes.previous,
                        label: 'Prev',
                        style: ButtonStyles.Primary
                      },
                      {
                        type: ButtonTypes.next,
                        label: 'Next',
                        style: ButtonStyles.Success
                      }
                    ]
                  });
            }
        }
        catch (error) {
            console.error(error);
            await interaction.editReply("Unable to retrieve image.");
            return;
        }
    },
};