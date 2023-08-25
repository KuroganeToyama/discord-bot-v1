const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Random image of anime girls UwU')
        .addStringOption(option => 
            option.setName('safe')
                .setDescription('Choose sfw or nsfw')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('tag')
                .setDescription('Choose a tag')
                .setRequired(true)),
    
    async execute(interaction) {
        try {
            const root = 'https://api.waifu.pics/';
            const safe = interaction.options.getString('safe');
            const tag = interaction.options.getString('tag');
            const apiCall = root.concat(safe, '/', tag);
            const response = await fetch(apiCall);
            const json = await response.json();
            const image = (safe === 'nsfw') ? (`|| ${json.url} ||`) : (json.url);
            await interaction.editReply(image);
        }
        catch (error) {
            await interaction.editReply("You mistyped something. Please try again");
            return;
        }
    },
};