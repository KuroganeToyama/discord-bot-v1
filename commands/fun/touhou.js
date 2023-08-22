const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('touhou')
        .setDescription('Random image of Touhou girls 東方'),
    
    async execute(interaction) {
        const apiCall = 'https://www.mylittlewallpaper.com/c/touhou/api/v1/random.json';
        //const apiCall = 'https://img.paulzzh.com/touhou/random?type=json';
        const response = await fetch(apiCall);
        const json = await response.json();
        await interaction.editReply(json.result[0].downloadurl);
        //await interaction.editReply(json.url);
    },
};