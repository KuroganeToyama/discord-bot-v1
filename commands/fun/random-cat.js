const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Random image of cat'),
    
    async execute(interaction) {
        const catResult = await fetch('https://api.thecatapi.com/v1/images/search');
        const json = await catResult.json();
        await interaction.editReply(json[0].url);
    },
};