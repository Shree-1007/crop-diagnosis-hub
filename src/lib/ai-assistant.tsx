// src/lib/ai-assistant.ts

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

export async function getOpenRouterCompletion(
  message: string,
  onUpdate?: (chunk: string) => void
): Promise<string> {
  try {
    if (onUpdate) {
      // Streaming implementation
      let fullResponse = "";
      
      const stream = await openai.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "mistralai/mistral-small-3.2-24b-instruct:free", // Using the specified free model
        stream: true,
      });
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          onUpdate(content);
        }
      }
      
      return fullResponse;
    } else {
      // Non-streaming fallback
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "mistralai/mistral-small-3.2-24b-instruct:free", // Using the specified free model
      });

      if (completion.choices[0].message.content === null) {
        return "Sorry, I could not provide a response.";
      }

      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error("Error fetching completion from OpenRouter:", error);
    return "An error occurred while fetching the response.";
  }
}