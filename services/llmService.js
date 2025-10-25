import Groq from "groq-sdk/index.mjs";
import process from "process";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const callLLMService = async (systemPrompt, userQuery) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.3-70b-versatile", // or other Groq models
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      stream: false,
    });

    return (
      chatCompletion.choices[0]?.message?.content || "No description generated"
    );
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("Failed to generate PR description via LLM service");
  }
};
