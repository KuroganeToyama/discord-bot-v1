const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice!')
        .addIntegerOption(option =>
            option.setName('integer')
                .setDescription('number of sides')
                .setRequired(true)),
    
    async execute(interaction) {
        const sides = interaction.options.getInteger('integer');
        const result = Math.floor(Math.random() * sides) + 1;
        await interaction.reply(`You rolled an ${sides}-sided dice. You got a ${result}!`);
    },
};