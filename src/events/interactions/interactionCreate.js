const { handleTicketOpen, handleTicketClose } = require("@src/handlers/ticket");

/**
 * @param {import("@src/structures").BotClient} client
 * @param {import("discord.js").Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.guild) {
    return interaction
      .reply({ content: "Command can only be executed in a discord server", ephemeral: true })
      .catch(() => {
      });
  }

  // Slash Command
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) await command.executeInteraction(interaction);
    else return interaction.reply({ content: "An error has occurred", ephemeral: true }).catch(() => {
    });
  }

  // Context Menu
  else if (interaction.isContextMenu()) {
    const context = client.contextMenus.get(interaction.commandName);
    if (context) await context.execute(interaction);
    else return interaction.reply({ content: "An error has occurred", ephemeral: true }).catch(() => {
    });
  }

  // Custom Buttons
  else if (interaction.isButton()) {
    // ticket create
    if (interaction.customId === "TICKET_CREATE") {
      await interaction.deferReply({ ephemeral: true });
      await handleTicketOpen(interaction);
    }

    // ticket close
    if (interaction.customId === "TICKET_CLOSE") {
      await interaction.deferReply({ ephemeral: true });
      await handleTicketClose(interaction);
    }
  }
};
