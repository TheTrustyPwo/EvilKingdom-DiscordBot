const { automodHandler, xpHandler, aiHandler } = require("@src/handlers");
const { getSettings } = require("@schemas/Guild");
const { sendMessage } = require("@utils/botUtils");

/**
 * @param {import("@src/structures").BotClient} client
 * @param {import("discord.js").Message} message
 */
module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;
  const settings = await getSettings(message.guild);
  const { prefix } = settings;

  // check for bot mentions
  if (message.content.includes(`${client.user.id}`)) {
    await sendMessage(message.channel, `My prefix is \`${settings.prefix}\``);
  }

  // ai chat
  if (message.channelId === "873754858346414080" && !message.content.startsWith(";")) {
    await aiHandler.handleMessage(message);
    return;
  }

  let isCommand = false;
  if (message.content.startsWith(prefix)) {
    const args = message.content.replace(`${prefix}`, "").split(/\s+/);
    const invoke = args.shift().toLowerCase();
    const cmd = client.getCommand(invoke);

    // command is found
    if (cmd) {
      isCommand = true;
      cmd.executeCommand(message, args, invoke, prefix);
    }
  }

  // if not a command
  if (!isCommand) {
    await automodHandler.performAutomod(message, settings);
    if (settings.ranking.enabled) xpHandler.handleXp(message);
  }
};
