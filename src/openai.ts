import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function createChatCompletion(input: {
  userMessage: string;
  username?: string;
}): Promise<string> {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Tu es OpenBot, un chatbot Discord simple, utile et concis. Réponds en français."
      },
      {
        role: "user",
        content: input.username
          ? `${input.username}: ${input.userMessage}`
          : input.userMessage
      }
    ],
    temperature: 0.7
  });

  return (
    response.choices[0]?.message?.content?.trim() ||
    "Je n'ai pas réussi à générer une réponse."
  );
}
