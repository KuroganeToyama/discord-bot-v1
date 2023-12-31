const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cv')
        .setDescription('Create a thread to review your resume!')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Set the name for your thread')
                .setRequired(true)),
    
    async execute(interaction) {
        try {
            const user = interaction.user.globalName;
            const channel = interaction.channel;
            const thread = await channel.threads.create({
                name: interaction.options.getString('name'),
                autoArchiveDuration: 60,
                reason: 'Separate thread for resume review',
            });
            await interaction.editReply(`Created resume thread **${thread.name}** for **${user}**`);
        }
        catch (error) {
            console.log(error)
            await interaction.editReply("Unable to create thread.");
            return;
        }
    },
};