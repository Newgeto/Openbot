import "dotenv/config";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { createChatCompletion } from "./openai";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!DISCORD_TOKEN) throw new Error("Missing DISCORD_TOKEN in environment");
if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY in environment");

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

    await message.channel.sendTyping();

    const answer = await createChatCompletion({
      userMessage: prompt,
      username: message.author.username
    });

    await message.reply(answer);
  } catch (err) {
    console.error(err);
    try {
      await message.reply("Erreur: impossible de générer une réponse pour le moment.");
    } catch {
    }
  }
});

client.login(DISCORD_TOKEN);
