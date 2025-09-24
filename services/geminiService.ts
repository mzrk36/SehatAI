
import { GoogleGenAI, Type } from "@google/genai";
import { XRayResult, Prescription, RiskScoreResult } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this prototype, we'll alert and log, assuming it's set in the env.
    console.error("API_KEY environment variable not set.");
    alert("CRITICAL: Gemini API Key is not configured.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeXray = async (imageData: string, mimeType: string): Promise<XRayResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: imageData,
                        },
                    },
                    {
                        text: "You are a specialized AI radiology assistant. Analyze this chest X-ray for signs of Tuberculosis or Pneumonia. Provide your analysis in a structured JSON format. The JSON object should contain: 'diagnosis' (string: 'Normal', 'Tuberculosis Suspected', 'Pneumonia Suspected', or 'Indeterminate'), 'confidence' (number from 0 to 1), and 'findings' (an array of strings describing key observations)."
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        diagnosis: { type: Type.STRING, enum: ['Normal', 'Tuberculosis Suspected', 'Pneumonia Suspected', 'Indeterminate'] },
                        confidence: { type: Type.NUMBER },
                        findings: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        const jsonText = response.text;
        return JSON.parse(jsonText) as XRayResult;
    } catch (error) {
        console.error("Error analyzing X-ray:", error);
        throw new Error("Failed to get analysis from AI. The image might be unsupported or the API key may be invalid.");
    }
};

export const digitizePrescription = async (imageData: string, mimeType: string): Promise<Prescription> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: imageData,
                        },
                    },
                    {
                        text: "You are an expert OCR system for medical prescriptions, fluent in both English and Urdu. Analyze the provided image of a handwritten prescription. Extract the information into a structured JSON format. The JSON object should contain: 'patientName' (string), 'date' (string, formatted as YYYY-MM-DD), and 'items' (an array of objects, where each object has 'medicine', 'dosage', and 'frequency' as strings)."
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        patientName: { type: Type.STRING },
                        date: { type: Type.STRING },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    medicine: { type: Type.STRING },
                                    dosage: { type: Type.STRING },
                                    frequency: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        const jsonText = response.text;
        return JSON.parse(jsonText) as Prescription;
    } catch (error) {
        console.error("Error digitizing prescription:", error);
        throw new Error("Failed to digitize prescription. The image might be unclear or the AI service is unavailable.");
    }
};

export const calculateRiskScore = async (patientData: Record<string, any>): Promise<RiskScoreResult> => {
    try {
        const prompt = `Based on the following patient data, act as a predictive health model to calculate a risk score for developing diabetes or heart disease in the next 10 years. Data: ${JSON.stringify(patientData)}. Return a JSON object with: 'score' (a number between 0 and 100), 'level' (a string: 'Low', 'Medium', 'High', or 'Very High'), 'explanation' (a brief summary of the primary factors), and 'riskFactors' (an array of strings listing the main contributing factors from the input data).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        level: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Very High'] },
                        explanation: { type: Type.STRING },
                        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        const jsonText = response.text;
        return JSON.parse(jsonText) as RiskScoreResult;
    } catch (error) {
        console.error("Error calculating risk score:", error);
        throw new Error("Failed to calculate risk score. Please check the input data and try again.");
    }
};
