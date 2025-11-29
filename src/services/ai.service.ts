/**
 * Wajba AI Service - Connects to n8n workflow for AI chat
 */

// n8n webhook URL - Update if your IP changes
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/wajba-chat';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DishRecommendation {
  id: string;
  name: string;
  restaurant: string;
  restaurantId?: string;
  price: number;
  image: string;
  rating: number;
  eta: string;
  spicyLevel?: number;
}

export interface AIResponse {
  response: string;
  timestamp: string;
  recommendations?: DishRecommendation[];
}

export interface AIResult {
  text: string;
  recommendations: DishRecommendation[];
}

/**
 * Send message to AI and get response
 */
export const sendAIMessage = async (
  message: string,
  context?: {
    userId?: string;
    userName?: string;
    location?: string;
  }
): Promise<AIResult> => {
  try {
    console.log('Sending to n8n:', message);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: {
          userId: context?.userId,
          userName: context?.userName,
          location: context?.location || 'Bahrain',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('Raw response from n8n:', text);

    const cleanedText = text.trim();
    if (!cleanedText) {
      console.warn('n8n returned an empty response');
      return {
        text: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
        recommendations: [],
      };
    }

    // Try to parse JSON
    try {
      const data: AIResponse = JSON.parse(cleanedText);
      return {
        text: data.response || cleanedText,
        recommendations: data.recommendations || [],
      };
    } catch (e) {
      console.error('Failed to parse JSON, using raw text instead:', e);
      return {
        text: cleanedText,
        recommendations: [],
      };
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback response if n8n is down
    return {
      text: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
      recommendations: [],
    };
  }
};

/**
 * Extract restaurant names from AI response text
 * Looks for any mention of restaurants ending with "Bahrain"
 */
export const extractRestaurantNames = (text: string): string[] => {
  const names: string[] = [];
  
  // Universal pattern: Match any capitalized name followed by "Bahrain"
  // This catches: "McDonald's Bahrain", "Pizza Hut Bahrain", etc.
  const bahrainPattern = /([A-Z][A-Za-z'\s.&-]+Bahrain)/g;
  let match;
  
  while ((match = bahrainPattern.exec(text)) !== null) {
    const name = match[1].trim();
    // Filter out common false positives and ensure reasonable length
    if (name && 
        name.length > 5 && 
        name.length < 40 && // Shorter max length to avoid sentences
        !names.includes(name) &&
        !name.match(/^(In|At|From|The|A|An|Here|Some|Options|Available)\s/i) &&
        !name.includes('options') &&
        !name.includes('available')) {
      names.push(name);
    }
  }
  
  console.log('Extracted restaurant names:', names);
  return names.slice(0, 10); // Max 10 restaurants
};

/**
 * Extract dish recommendations from AI response text
 * Returns array of {dishName, restaurantName} pairs
 * Handles multiple formats flexibly
 */
export const extractDishRecommendations = (text: string): Array<{dishName: string, restaurantName: string}> => {
  const recommendations: Array<{dishName: string, restaurantName: string}> = [];
  
  // Split by numbered items (1., 2., 3., etc. or ### 1., ### 2., etc.)
  const dishBlocks = text.split(/(?:###\s*)?\d+\.\s+/);
  
  for (const block of dishBlocks) {
    if (!block.trim()) continue;
    
    let dishName = '';
    let restaurantName = '';
    
    // Try Pattern 1: Restaurant in heading, dish in **Dish:** field
    // Format: ### 1. **Nando's Bahrain**\n   - **Dish:** PERi‑PERi 1/2 Chicken
    const headingRestaurant = block.match(/^\s*\*\*([A-Z][A-Za-z'\s.&-]+Bahrain)\*\*/);
    const dishField = block.match(/-?\s*\*\*Dish:\*\*\s*([^\n]+)/i);
    
    if (headingRestaurant && dishField) {
      restaurantName = headingRestaurant[1].trim();
      dishName = dishField[1].trim();
    } else {
      // Try Pattern 2: Dish at start, restaurant in **Restaurant:** field
      // Format: 1. **PERi‑PERi 1/2 Chicken**\n   - **Restaurant:** Nando's Bahrain
      const headingDish = block.match(/^\s*\*\*([^*]+)\*\*/);
      const restaurantField = block.match(/-?\s*\*\*Restaurant:\*\*\s*([^\n]+)/i);
      
      if (headingDish && restaurantField) {
        dishName = headingDish[1].trim();
        restaurantName = restaurantField[1].trim();
      }
    }
    
    // Validate and add
    if (dishName && 
        restaurantName &&
        dishName.length < 100 && 
        !dishName.includes('Bahrain') &&
        restaurantName.includes('Bahrain')) {
      recommendations.push({ dishName, restaurantName });
    }
  }
  
  console.log('🍽️ Extracted dish recommendations:', recommendations.length);
  console.log('📋 Details:', recommendations.map(r => `${r.dishName} @ ${r.restaurantName}`).join(' | '));
  return recommendations.slice(0, 10);
};

/**
 * Get suggested prompts for users
 */
export const getSuggestedPrompts = (): string[] => {
  return [
    "What restaurants are nearby?",
    "I want something spicy 🌶️",
    "Show me vegetarian options",
    "What's good for breakfast?",
    "Recommend a pizza place",
    "I'm craving seafood",
  ];
};
