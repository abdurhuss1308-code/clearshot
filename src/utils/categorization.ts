import { Card, ExtractedData, CardCategory } from '../types';

const CATEGORIZATION_SYSTEM_PROMPT = `You are a screenshot triage assistant. Look at the attached image and classify it into exactly one of these categories: shopping, travel, contact, note, task, or other. Extract only the fields relevant to that category and leave every other field null. Set \`is_sensitive\` to true if the image shows authentication codes, one-time passcodes, passwords, credit card numbers, bank details, or other private financial or security information. Normalize any date you find to YYYY-MM-DD format. Respond with ONLY valid JSON matching the schema below — no markdown formatting, no code fences, no commentary before or after it.`;

export interface CategorizationResponse {
  category: CardCategory;
  confidence: number;
  title: string;
  is_sensitive: boolean;
  raw_text: string;
  extracted_data: ExtractedData;
}

const FALLBACK_RESPONSE: CategorizationResponse = {
  category: 'other',
  confidence: 0,
  title: 'Untitled screenshot',
  is_sensitive: false,
  raw_text: '',
  extracted_data: {},
};

const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

// Simulated edge function call - in production, this would call a real edge function
export const categorizeScreenshot = async (base64Image: string): Promise<CategorizationResponse> => {
  try {
    // In production, this would be:
    // const response = await fetch('/api/categorize-screenshot', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ image: base64Image })
    // });

    // For now, simulate the API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated categorization - in production this comes from AI
        const mockResponse: CategorizationResponse = {
          category: 'other',
          confidence: 0.75,
          title: 'Screenshot',
          is_sensitive: false,
          raw_text: 'Screenshot content would be analyzed here',
          extracted_data: {},
        };
        resolve(mockResponse);
      }, 800);
    });
  } catch (error) {
    console.error('Categorization error:', error);
    return FALLBACK_RESPONSE;
  }
};

// Retry categorization once if it fails
export const categorizeScreenshotWithFallback = async (base64Image: string): Promise<CategorizationResponse> => {
  try {
    const response = await categorizeScreenshot(base64Image);
    return response;
  } catch (error) {
    console.error('First categorization attempt failed, retrying...', error);
    try {
      return await categorizeScreenshot(base64Image);
    } catch (retryError) {
      console.error('Second categorization attempt failed, using fallback', retryError);
      return FALLBACK_RESPONSE;
    }
  }
};
