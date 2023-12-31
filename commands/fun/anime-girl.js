const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const sfwList = ['waifu', 'neko'];
let sfwEmbedList = '';

sfwList.forEach((item, index) => {
    sfwEmbedList += `\`${index + 1}\` ${item}\n`;
});

const tagsEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('List of tags to use')
    .setTimestamp()
    .addFields({ name: 'SFW', value: sfwEmbedList });

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
                channel.send({ embeds: [tagsEmbed] });
            }
        }
        catch (error) {
            console.error(error);
            await interaction.editReply("Unable to retrieve image.");
            return;
        }
    },
};