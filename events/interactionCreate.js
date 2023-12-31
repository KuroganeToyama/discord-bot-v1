const { Events } = require('discord.js');
const fs = require('fs');

// Read in the list of commands
let APICommands = [];
fs.readFile('events/cmdList.txt', 'utf8', (err, data) => {
	if (err) {
	  console.error(err);
	  return;
	}
	APICommands = data.split('\n').map(line => line.trim());
});

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			if (APICommands.includes(interaction.commandName)) {
				await interaction.deferReply();
			}
	
			try {
				await command.execute(interaction);
			} 
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
        }
		else {
			return;
		}
	},
};
