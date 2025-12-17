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
  isRestaurant?: boolean;
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
      let data = JSON.parse(cleanedText);
      console.log('Parsed JSON data:', data);
      
      // Check if response field contains another JSON string (double-encoded or markdown-wrapped)
      if (data.response && typeof data.response === 'string') {
        let innerResponse = data.response.trim();
        
        // Strip markdown code blocks if present
        if (innerResponse.startsWith('```json') || innerResponse.startsWith('```')) {
          console.log('Detected markdown code block, stripping...');
          innerResponse = innerResponse
            .replace(/^```json\s*\n?/i, '')
            .replace(/^```\s*\n?/, '')
            .replace(/\n?```\s*$/,'')
            .trim();
          console.log('Stripped markdown, result:', innerResponse.substring(0, 100) + '...');
        }
        
        // Try to parse the inner JSON
        if (innerResponse.startsWith('{')) {
          try {
            console.log('Parsing inner JSON...');
            data = JSON.parse(innerResponse);
            console.log('Successfully parsed inner data');
          } catch (e) {
            console.log('Failed to parse inner JSON:', e);
          }
        }
      }
      
      // Check if it's the new format with message, restaurants, menu_items
      if (data.message) {
        const recommendations: DishRecommendation[] = [];
        
        // Convert restaurants to recommendations
        if (data.restaurants && Array.isArray(data.restaurants)) {
          console.log(`Converting ${data.restaurants.length} restaurants to recommendations`);
          data.restaurants.forEach((restaurant: any) => {
            recommendations.push({
              id: restaurant.id,
              name: restaurant.name,
              restaurant: restaurant.name,
              restaurantId: restaurant.id,
              price: restaurant.minimum_order || 0,
              image: restaurant.image_url || '',
              rating: restaurant.rating || 4.5,
              eta: restaurant.delivery_time || '30-40 min',
              isRestaurant: true, // Flag to identify restaurants
            });
          });
        }
        
        // Convert menu_items to recommendations
        if (data.menu_items && Array.isArray(data.menu_items)) {
          console.log(`Converting ${data.menu_items.length} menu items to recommendations`);
          data.menu_items.forEach((item: any) => {
            recommendations.push({
              id: item.id,
              name: item.name,
              restaurant: item.restaurant || 'Restaurant',
              restaurantId: item.restaurant_id,
              price: item.price,
              image: item.image_url || '',
              rating: 4.5,
              eta: '20-30 min',
            });
          });
        }
        
        console.log(`Returning ${recommendations.length} total recommendations`);
        return {
          text: data.message,
          recommendations,
        };
      }
      
      // Fallback to old format
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
