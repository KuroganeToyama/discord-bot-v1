const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Random quote from anime characters. You can choose as well!')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Choose anime or character'))
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Choose a name')),
    
    async execute(interaction) {
        const root = 'https://animechan.xyz/api/random/';
        const type = interaction.options.getString('type');
        const name = interaction.options.getString('name');
        let apiCall = root;
        if (type === 'anime') {
            apiCall = root.concat(type, '?', 'title=', name);
        }
        else if (type === 'character') {
            apiCall = root.concat(type, '?', 'name=', name);
        }
        const response = await fetch(apiCall);
        const json = await response.json();
        await interaction.editReply(`"${json.quote}"\n~ ${json.character}, from ${json.anime} ~`);
    },
};