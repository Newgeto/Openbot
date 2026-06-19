import OpenAI from "openai";
import { config } from "./config";
import type { ChatTurn } from "./memory";

const client = new OpenAI({
  apiKey: config.openaiApiKey
});

export async function createChatCompletion(input: {
  userMessage: string;
  username?: string;
  history?: ChatTurn[];
}): Promise<string> {
  const userContent = input.username
    ? `${input.username}: ${input.userMessage}`
    : input.userMessage;

  const response = await client.chat.completions.create({
    model: config.openaiModel,
    messages: [
      { role: "system", content: config.systemPrompt },
      ...(input.history ?? []),
      { role: "user", content: userContent }
    ],
    temperature: 0.7
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "Je n'ai pas réussi à générer une réponse."
  );
}
