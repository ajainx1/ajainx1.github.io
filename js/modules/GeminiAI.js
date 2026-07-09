import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiAI {
  constructor(apiKey) {
    if (!apiKey) throw new Error("API Key is required");
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateQuestion(category) {
    const prompt = `
    Generate a multiple-choice question for a quiz. The category is "${category}".
    Return the response as a JSON string with no markdown formatting. It must match this format perfectly:
    {
      "question": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "answer": 1,
      "explanation": "Paris is the capital of France."
    }
    Make sure the answer index matches the correct option in the array (0-indexed).
    Make the questions engaging and moderately difficult.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      // Clean up markdown in case the model returns it despite instructions
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw error;
    }
  }
}
