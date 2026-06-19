import { Client, GatewayIntentBits, Events } from "discord.js";
import { config } from "./config";
import { createChatCompletion } from "./openai";
import { getHistory, recordTurn } from "./memory";
import { allowRequest } from "./rateLimit";
import { splitMessage } from "./discord";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;
    if (!client.user) return;

    const wasMentioned = message.mentions.has(client.user);
    if (!wasMentioned) return;

    const prompt = message.content
      .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
      .trim();

    if (!prompt) {
      await message.reply("Dis-moi quelque chose après le ping 🙂");
      return;
    }

    if (!allowRequest(message.author.id)) {
      await message.reply(
        "Tu vas un peu vite 🙂 attends quelques secondes avant de me repinger."
      );
      return;
    }

    await message.channel.sendTyping();

    const history = getHistory(message.channelId);
    const answer = await createChatCompletion({
      userMessage: prompt,
      username: message.author.username,
      history
    });

    recordTurn(message.channelId, { role: "user", content: prompt });
    recordTurn(message.channelId, { role: "assistant", content: answer });

    const chunks = splitMessage(answer);
    await message.reply(chunks[0]);
    for (const chunk of chunks.slice(1)) {
      await message.channel.send(chunk);
    }
  } catch (err) {
    console.error(err);
    try {
      await message.reply("Erreur: impossible de générer une réponse pour le moment.");
    } catch {
    }
  }
});

client.login(config.discordToken);
