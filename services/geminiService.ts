
import { GoogleGenAI, Type } from "@google/genai";
import { MindMapCategory } from '../types';

const getAi = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
}

export const getPollutionIdeas = async (category: MindMapCategory): Promise<string | null> => {
    try {
        const ai = getAi();
        const prompt = `Generate one brief, distinct idea for a mind map about pollution, specifically for the category: '${category}'. The idea should be suitable for middle school students.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        idea: {
                            type: Type.STRING,
                            description: "A single, concise idea for the mind map.",
                        },
                    },
                    required: ["idea"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        if (!jsonText) {
            console.warn("Gemini API returned empty text.");
            return null;
        }

        const result = JSON.parse(jsonText);
        return result.idea || null;

    } catch (error) {
        console.error("Error fetching idea from Gemini API:", error);
        // You might want to return a default suggestion or throw the error
        // to be handled by the caller. For this app, returning null is safe.
        return null;
    }
};
