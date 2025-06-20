// GeminiService.ts
// A service for interacting with the Gemini API

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

class GeminiService {
  private static API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with actual API key or env variable
  private static API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  /**
   * Generate content using Gemini API
   * @param prompt The prompt to send to Gemini
   * @returns The generated content
   */
  public static async generateContent(prompt: string): Promise<string> {
    try {
      const requestBody: GeminiRequest = {
        contents: [
        {
          parts: [
          {
            text: prompt
          }]

        }]

      };

      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as GeminiResponse;
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "Sorry, I couldn't generate recommendations at this time.";
    }
  }

  /**
   * Generate travel recommendations based on user preferences and history
   * @param userPreferences User preferences data
   * @returns Travel recommendations
   */
  public static async generateTravelRecommendations(userPreferences: any): Promise<any[]> {
    const prompt = `
      Based on the following user preferences and activity history, suggest 3 personalized travel destinations and activities:
      
      User preferences: ${JSON.stringify(userPreferences)}
      
      Format your response as a JSON array with the following structure for each recommendation:
      [
        {
          "destination": "Destination name",
          "activities": ["Activity 1", "Activity 2"],
          "reason": "Why this is recommended based on user preferences"
        }
      ]
    `;

    try {
      const response = await this.generateContent(prompt);
      // Parse JSON response
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating travel recommendations:', error);
      return [
      {
        destination: "Paris, France",
        activities: ["Visit the Eiffel Tower", "Explore the Louvre"],
        reason: "Popular destination with cultural attractions"
      }];

    }
  }
}

export default GeminiService;