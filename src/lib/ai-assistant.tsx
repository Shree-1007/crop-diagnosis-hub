// src/lib/ai-assistant.ts

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: " 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",
  dangerouslyAllowBrowser: true,
});

export async function getOpenRouterCompletion(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "google/gemma-7b-it:free", // Or any other free model
    });

    if (completion.choices[0].message.content === null) {
      return "Sorry, I could not provide a response.";
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion from OpenRouter:", error);
    return "An error occurred while fetching the response.";
  }
}