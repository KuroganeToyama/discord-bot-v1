const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');

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

        const reroll = new ButtonBuilder()
            .setCustomId('reroll')
            .setLabel('Reroll')
            .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(reroll, cancel);

        const response = await interaction.reply({
            content: `You rolled a ${sides}-dice. You got ${result}!`,
            components: [row],
        });
        
        const collectionFilter = i => i.user.id == interaction.user.id;

        while (true) {
            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectionFilter, time: 60000 });
                
                if (confirmation.customId == 'reroll') {
                    const result = Math.floor(Math.random() * sides) + 1;
                    await confirmation.update({ content: `You rolled a ${sides}-dice. You got ${result}!`,
                                                components: [row] });
                }
                else if (confirmation.customId == 'cancel') {
                    await confirmation.update({ content: `No more rolling...`,
                                                components: [] });
                    return;
                }
            }
            catch (error) {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                return;
            }
        }
    },
};