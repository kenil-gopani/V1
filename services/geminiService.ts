import { GoogleGenAI, Type } from '@google/genai';
import { QuizQuestion } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getTutorResponse = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      messages: history,
      config: {
        systemInstruction: `You are a helpful, encouraging, and knowledgeable academic tutor on the EduVerse platform. 
        Your goal is to help students learn concepts, solve problems, and provide study tips. 
        Keep your answers concise, clear, and engaging. Use markdown for formatting.`
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

export const generateQuizFromText = async (text: string): Promise<QuizQuestion[]> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a quiz with 3 to 5 multiple choice questions based on the following text. 
      The questions should test understanding of key concepts.
      
      Text to analyze:
      "${text}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanation']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Gemini Quiz Gen Error:", error);
    throw error;
  }
};

export const generateSummary = async (text: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following educational content into concise bullet points suitable for flashcards or quick review.
      
      Content:
      "${text}"`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Summary Gen Error:", error);
    return "Error generating summary.";
  }
};