/**
 * Wajba AI Service - Direct OpenAI Integration for Customer AI Assistant
 */
// @ts-nocheck

import { supabase } from '../lib/supabase';

// OpenAI API configuration
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Inline AI Knowledge Base (embedded directly in code for React Native compatibility)
const AI_KNOWLEDGE_BASE = `
===========================================
WAJBA AI ASSISTANT - COMPREHENSIVE KNOWLEDGE BASE
===========================================

CUISINE TYPES & CHARACTERISTICS:

ITALIAN: Pasta, Pizza, Risotto, Lasagna | Tomato-based, cheese-heavy | Lunch, Dinner | Mid-range to Premium
CHINESE: Fried rice, Noodles, Dumplings, Sweet & sour | Savory, umami-rich, stir-fried | Lunch, Dinner | Budget to Mid-range
AMERICAN/FAST FOOD: Burgers, Fried chicken, Steaks, Sandwiches | Hearty, fried, comfort food | Lunch, Dinner, Snacks | Budget to Mid-range
MEXICAN: Tacos, Burritos, Quesadillas, Nachos | Spicy, cheese-heavy | Lunch, Dinner, Snacks | Budget to Mid-range
MIDDLE EASTERN/ARABIC: Shawarma, Kebabs, Falafel, Grilled meats | Grilled, aromatic spices, healthy | Lunch, Dinner | Budget to Mid-range
INDIAN: Curry, Biryani, Tandoori, Samosas | Spicy, aromatic, vegetarian-friendly | Lunch, Dinner | Budget to Mid-range
JAPANESE: Sushi, Ramen, Teriyaki, Tempura | Fresh, light, balanced, seafood-heavy | Lunch, Dinner | Mid-range to Premium
THAI: Pad Thai, Curry, Tom Yum, Fried rice | Sweet, sour, salty, spicy balance | Lunch, Dinner | Budget to Mid-range

MEAL TIMING RULES:

BREAKFAST (6-11 AM): Coffee, Eggs, Pancakes, Breakfast sandwiches, Pastries | NOT: Heavy pasta, Steaks, Dinner meals
LUNCH (11 AM-3 PM): Sandwiches, Burgers, Pasta, Salads, Rice bowls, Pizza | NOT: Just coffee/drinks, Only desserts
DINNER (5-10 PM): Full meals, Steaks, Seafood, Pasta, Curry, Grilled meats | NOT: Just breakfast items, Light snacks only
SNACKS (Anytime): Fries, Wings, Nachos, Small sandwiches, Desserts | Light items

DIETARY RESTRICTIONS:

VEGETARIAN: Can eat vegetables, dairy, eggs | Cannot eat meat, fish | Recommend: Veggie pasta, pizza, salads, falafel
VEGAN: Can eat vegetables, grains, beans | Cannot eat animal products | Recommend: Vegan pasta, stir-fry, hummus, tofu
HALAL: Can eat halal meat, chicken, fish | Cannot eat pork, alcohol | Recommend: Halal chicken, shawarma, kebabs, grilled meats
GLUTEN-FREE: Can eat rice, meat, vegetables | Cannot eat wheat, bread, pasta | Recommend: Rice bowls, grilled meats, salads
KETO/LOW-CARB: High fat, moderate protein, very low carbs | Avoid bread, pasta, rice | Recommend: Grilled meats, salads, eggs
HIGH-PROTEIN: 20g+ protein per meal | Recommend: Grilled chicken, steak, fish, eggs, protein bowls
LOW-CALORIE: Under 500 cal per meal | Recommend: Salads, grilled fish, steamed vegetables, light wraps

OCCASIONS & CONTEXTS:

DATE NIGHT: Romantic, quiet, intimate | Recommend: Fine dining, Italian, Mediterranean, Upscale | Avoid: Fast food, loud places
FAMILY: Family-friendly, kids menu | Recommend: Pizza, American, Buffets | Need: Kids menu, family portions
SPORTS: Lively, TVs, energetic | Recommend: Wings, Burgers, Nachos, Fries | Need: Live sports, bar seating
QUICK BITE: Fast service, under 15 min | Recommend: Fast food, Sandwiches, Wraps | Prep time: Under 15 min
POST-WORKOUT: High protein, recovery | Recommend: Grilled chicken, Protein bowls, Smoothies, Eggs | Need: 20g+ protein

SPICE LEVELS:

LEVEL 0 (No Spice): Plain pasta, Cheese pizza, Grilled chicken, Salads, Most American food
LEVEL 1-2 (Mild): Mild curry, Light Mexican, Mild wings, Teriyaki
LEVEL 3 (Medium): Medium curry, Standard Mexican, Medium wings, Some Thai
LEVEL 4-5 (Hot/Very Hot): Spicy curry (vindaloo), Hot wings (buffalo, habanero), Spicy Thai, Jalapeño dishes, Szechuan

PRICE RANGES:

BUDGET (Under BD 5): Fast food burgers, Pizza slices, Sandwiches, Shawarma, Fried rice
MID-RANGE (BD 5-15): Full pizza, Restaurant pasta, Grilled chicken, Curry, Sushi rolls, Rice bowls
PREMIUM (BD 15-30): Steaks, Seafood platters, Fine dining pasta, Premium sushi
LUXURY (BD 30+): High-end steaks, Lobster, Fine dining tasting menus

FOOD PAIRING:

PIZZA pairs with: Garlic bread, Wings, Salad
BURGERS pair with: Fries, Onion rings, Coleslaw, Milkshakes
PASTA pairs with: Garlic bread, Caesar salad, Tiramisu
SUSHI pairs with: Miso soup, Edamame, Green tea
CURRY pairs with: Naan bread, Rice, Samosas, Mango lassi
TACOS pair with: Guacamole, Salsa, Chips, Mexican rice
STEAK pairs with: Mashed potatoes, Grilled vegetables, Salad

RECOMMENDATION LOGIC:

"LUNCH" → Recommend MAIN COURSES (pasta, burgers, rice bowls, salads) | NOT coffee/snacks | Moderate portions | Under 30 min prep
"DINNER" → Recommend FULL MEALS (steaks, seafood, pasta, curry) | Larger portions | Can be 30-45 min prep
"ITALIAN FOOD" → ONLY Italian dishes (pasta, pizza, risotto) | NOT other cuisines | Mention Italian restaurants
"HEALTHY" → Grilled not fried | Include calories | Recommend salads, grilled meats, vegetables | Avoid heavy sauces
"QUICK/FAST" → Prep time under 15 min | Fast food, sandwiches, wraps | Quick service restaurants
"SPICY" → Spice level 3-5 | Curry, wings, Thai, Mexican | Mention spice level | Offer mild alternatives
"CHEAP/BUDGET" → Under BD 5 | Fast food, simple dishes
"VEGETARIAN" → NO meat/fish | Veggie pasta, pizza, salads, falafel
"VEGAN" → NO animal products | Vegan pasta, stir-fry, hummus, tofu

COMMON QUERIES:

"I'm hungry" → Ask: What type? Meal time? Preferences?
"Something good" → Recommend top-rated across categories
"Surprise me" → Diverse options from different cuisines
"Comfort food" → Burgers, pizza, pasta, fried chicken
"Light meal" → Salads, soups, small portions
"Filling meal" → Large portions, protein-heavy, rice/pasta

CRITICAL RULES:
1. When user asks for "lunch" or "dinner" → Recommend MAIN COURSES, not snacks or drinks
2. When user asks for specific cuisine → Only recommend dishes from that cuisine type
3. Always check category and meal_types fields for appropriate recommendations
4. Cross-reference this knowledge with actual available dishes in database
5. NEVER recommend something not in the database
`;


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
 * Send message to AI and get response with restaurant/dish recommendations
 */
export const sendAIMessage = async (
  message: string,
  context?: {
    userId?: string;
    userName?: string;
    location?: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
): Promise<AIResult> => {
  try {
    console.log('🤖 Sending to OpenAI:', message);
    
    // Validate API key first
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key-here') {
      console.error('⚠️ OpenAI API key is not configured!');
      return {
        text: "⚠️ AI Assistant is not configured. Please add your OpenAI API key to the .env file.\n\nSteps:\n1. Get API key from https://platform.openai.com/api-keys\n2. Add to .env: EXPO_PUBLIC_OPENAI_API_KEY=sk-...\n3. Restart the app",
        recommendations: [],
      };
    }
    
    console.log('✅ API key found:', apiKey.substring(0, 10) + '...');

    // Fetch available restaurants and dishes from database
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select(`
        id,
        name,
        category,
        cuisine_types,
        rating,
        avg_prep_time,
        delivery_fee,
        min_order,
        price_range,
        ambiance,
        dietary_options,
        suitable_for,
        features,
        signature_dishes,
        logo,
        banner_image,
        address
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(30);

    console.log('🏪 Restaurants fetched:', restaurants?.length || 0);
    if (restaurantsError) console.error('❌ Restaurants error:', restaurantsError);
    if (restaurants && restaurants.length > 0) {
      console.log('📋 Sample restaurant:', {
        name: restaurants[0].name,
        min_order: restaurants[0].min_order,
        category: restaurants[0].category,
      });
    }

    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select(`
        id, 
        name, 
        description, 
        price, 
        image, 
        category,
        is_available,
        restaurant_id,
        spice_level,
        is_vegetarian,
        calories,
        dietary_tags,
        meal_types,
        restaurants (name, cuisine_types, rating, delivery_fee, price_range)
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(100);

    console.log('🍽️ Dishes fetched:', dishes?.length || 0);
    if (dishesError) console.error('❌ Dishes error:', dishesError);

    // If no data, try without filters
    if (!restaurants || restaurants.length === 0) {
      console.log('⚠️ No active restaurants found, trying without is_active filter...');
      const { data: allRestaurants } = await supabase
        .from('restaurants')
        .select('id, name, category, rating, min_order, avg_prep_time')
        .order('rating', { ascending: false })
        .limit(30);
      console.log('🏪 Total restaurants in DB:', allRestaurants?.length || 0);
      if (allRestaurants && allRestaurants.length > 0) {
        console.log('📋 Sample restaurant:', allRestaurants[0]);
      }
    }

    if (!dishes || dishes.length === 0) {
      console.log('⚠️ No available dishes found, trying without is_available filter...');
      const { data: allDishes } = await supabase
        .from('dishes')
        .select('id, name, price, category, restaurant_id')
        .limit(100);
      console.log('🍽️ Total dishes in DB:', allDishes?.length || 0);
    }

    // Build enhanced context for AI with detailed information
    const restaurantContext = restaurants?.map(r => {
      const details = [];
      if (r.category) details.push(`Cuisine: ${r.category}`);
      if (r.cuisine_types?.length) details.push(`Types: ${r.cuisine_types.join(', ')}`);
      if (r.rating) details.push(`Rating: ${r.rating}⭐`);
      if (r.avg_prep_time) details.push(`Prep: ${r.avg_prep_time}`);
      if (r.delivery_fee) details.push(`Delivery: BD ${r.delivery_fee}`);
      if (r.min_order) details.push(`Min Order: BD ${r.min_order}`);
      if (r.price_range) details.push(`Price: ${r.price_range}`);
      if (r.ambiance?.length) details.push(`Ambiance: ${r.ambiance.join(', ')}`);
      if (r.dietary_options?.length) details.push(`Dietary: ${r.dietary_options.join(', ')}`);
      if (r.suitable_for?.length) details.push(`Good for: ${r.suitable_for.join(', ')}`);
      if (r.features?.length) details.push(`Features: ${r.features.join(', ')}`);
      if (r.signature_dishes?.length) details.push(`Signature: ${r.signature_dishes.join(', ')}`);
      
      return `• ${r.name}\n  ${details.join(' | ')}`;
    }).join('\n\n') || 'No restaurants available';

    const dishesContext = dishes?.slice(0, 30).map(dish => {
      const details = [];
      details.push(`BD ${dish.price}`);
      if (dish.category) details.push(dish.category);
      if (dish.is_vegetarian) details.push('🌱 Vegetarian');
      if (dish.spice_level) details.push(`🌶️ Spice: ${dish.spice_level}/5`);
      if (dish.calories) details.push(`${dish.calories} cal`);
      if (dish.dietary_tags?.length) details.push(dish.dietary_tags.join(', '));
      if (dish.meal_types?.length) details.push(`Meal: ${dish.meal_types.join(', ')}`);
      
      return `• ${dish.name} at ${dish.restaurants?.name}\n  ${details.join(' | ')}`;
    }).join('\n\n') || 'No dishes available';

    // Get user's order history for personalization (if userId provided)
    let orderHistory = '';
    if (context?.userId) {
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('order_items(menu_items(name, category))')
        .eq('user_id', context.userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentOrders?.length) {
        const previousDishes = recentOrders
          .flatMap(o => o.order_items?.map(i => i.menu_items?.name))
          .filter(Boolean)
          .slice(0, 5);
        if (previousDishes.length) {
          orderHistory = `\n\nUser's Recent Orders: ${previousDishes.join(', ')}`;
        }
      }
    }

    // Create enhanced system prompt with knowledge base
    const systemPrompt = `You are Wajba AI Assistant, an expert food recommendation system for customers in Bahrain.

COMPREHENSIVE FOOD & CUISINE KNOWLEDGE:
${AI_KNOWLEDGE_BASE}

CORE RESPONSIBILITIES:
1. Use the knowledge base above to understand food contexts, cuisines, meal timing, and dietary needs
2. Analyze customer requests using this deep knowledge to provide PERFECT recommendations
3. Provide ACCURATE recommendations ONLY from the available data below
4. Match restaurants and dishes based on multiple factors: taste preferences, dietary needs, price range, ambiance, occasion
5. Be conversational, friendly, and helpful
6. NEVER recommend restaurants or dishes not in the list below

AVAILABLE RESTAURANTS IN BAHRAIN:
${restaurantContext}

AVAILABLE DISHES:
${dishesContext}
${orderHistory}

RECOMMENDATION GUIDELINES:
• For dietary needs (vegetarian, vegan, halal, gluten-free): Check dietary_options and dietary_tags
• For occasions (date night, sports, family): Check suitable_for and ambiance
• For spice preferences: Use spice_level (0=no spice, 5=extreme)
• For health-conscious: Check calories, dietary_tags (high-protein, low-carb, keto)
• For meal timing: Check meal_types (breakfast, lunch, dinner, snack)
• Consider user's order history for personalization

⚠️ CRITICAL BUDGET RULES (MUST FOLLOW):
• When user specifies budget (e.g., "I have BD 2", "under BD 5", "cheap"):
  1. ONLY recommend dishes where price ≤ user's budget
  2. ONLY recommend restaurants where min_order ≤ user's budget
  3. If user says "I have BD 2" → ONLY show items BD 2 or less
  4. If user says "under BD 5" → ONLY show items under BD 5
  5. If NO items fit budget → Tell user honestly "Nothing available for BD X, cheapest option is BD Y"
• NEVER recommend items above user's stated budget - this is CRITICAL
• Budget examples:
  - "I have BD 2" → Show ONLY items ≤ BD 2 (Coca-Cola BD 1, Fries BD 1.5, etc.)
  - "I have BD 5" → Show ONLY items ≤ BD 5 (Shawarma BD 3, Small pizza BD 4.5, etc.)
  - "I have BD 10" → Show items ≤ BD 10 (Burgers BD 6-8, Pasta BD 7-9, etc.)

MEAL CONTEXT UNDERSTANDING:
• **Breakfast**: Coffee, pastries, eggs, pancakes, breakfast sandwiches, smoothies, juice
• **Lunch**: Main courses (pasta, rice bowls, burgers, wraps, salads, sandwiches), NOT just snacks
• **Dinner**: Full meals (steaks, seafood, pasta, rice dishes, grilled items), heavier portions
• **Snacks**: Light items (fries, wings, small bites, desserts)
• **Coffee/Drinks**: Beverages are NOT meals - if someone asks for lunch, don't recommend just coffee

FOOD PAIRING LOGIC:
• Italian food = pasta, pizza, risotto, lasagna, tiramisu
• Chinese food = fried rice, noodles, dumplings, sweet & sour dishes
• Fast food = burgers, fries, chicken, sandwiches
• Healthy = salads, grilled items, low-calorie dishes
• Comfort food = pasta, burgers, pizza, fried items

IMPORTANT RULES:
1. When user asks for "lunch" or "dinner" → Recommend MAIN COURSES, not snacks or drinks
2. When user asks for specific cuisine → Only recommend dishes from that cuisine type
3. Sandwiches/wraps are acceptable for lunch, but prefer full meals when available
4. Always check the category and meal_types fields to ensure appropriate recommendations

RESPONSE FORMAT:
1. Start with a friendly acknowledgment of their request
2. When asked for "places", "restaurants", or "where to eat": Recommend 2-3 RESTAURANTS by name
3. When asked for specific dishes or food: Recommend specific dishes
4. Mention key details (rating, prep time, min order, special features)
5. Keep response concise (3-4 sentences max)
6. ALWAYS use exact restaurant and dish names from the data above

EXAMPLES:
❌ Bad: "There are many great Italian restaurants in Bahrain"
❌ Bad for "I want lunch": Recommending just coffee or snacks
✅ Good for "Show me coffee places": "For coffee, I recommend Costa Coffee (4.6⭐, 8-12 min prep, min order BD 4) and Cafe Lilou (4.75⭐, 10-15 min prep, min order BD 5). Both offer great coffee selections!"
✅ Good for "I want lunch": "For lunch, try the Grilled Chicken Pasta at Olive Garden (BD 9.5) or the Beef Burger at Hardee's (BD 6.5). Both are filling main courses perfect for lunch!"
✅ Good for "I want Italian food": "For Italian, I recommend the Margherita Pizza at Domino's (BD 7) or the Fettuccine Alfredo at La Vinoteca (BD 8.5). Both authentic Italian dishes!"
✅ Good for "Something healthy": "For a healthy option, try the Grilled Salmon Salad at Fresh & Fit (BD 12, 450 cal, high-protein) or the Quinoa Bowl at Healthy Bites (BD 8.5, 380 cal, vegan)!"

Customer Context:
• Location: ${context?.location || 'Bahrain'}
• User: ${context?.userName || 'Guest'}

Remember: ONLY recommend from the available data. Be specific, accurate, and helpful!`;

    // Build messages array with conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if provided (last 5 messages for context)
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-5);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API directly using fetch
    console.log('📡 Calling OpenAI API...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const completion = await response.json();
    const aiResponse = completion.choices[0]?.message?.content || '';
    console.log('✅ OpenAI Response:', aiResponse);

    // Extract budget from user message if specified
    const budgetMatch = message.match(/(?:have|got|budget|under|max|maximum)\s*(?:is|of)?\s*(?:BD|bd)?\s*(\d+(?:\.\d+)?)/i);
    const userBudget = budgetMatch ? parseFloat(budgetMatch[1]) : null;
    if (userBudget) {
      console.log(`💰 User budget detected: BD ${userBudget}`);
    }

    // Extract restaurant and dish recommendations from the response
    const recommendations: DishRecommendation[] = [];

    // Find mentioned restaurants with flexible matching
    const responseLower = aiResponse.toLowerCase();
    const mentionedRestaurants = restaurants?.filter(r => {
      const restaurantNameLower = r.name.toLowerCase();
      
      // Exact match
      if (responseLower.includes(restaurantNameLower)) return true;
      
      // Handle possessive forms (e.g., "Domino's" matches "Domino's Pizza")
      const possessiveForm = restaurantNameLower.replace(/['']s\s/g, "'s ");
      if (responseLower.includes(possessiveForm)) return true;
      
      // Handle partial matches (e.g., "Domino's" in response matches "Domino's Pizza" in DB)
      const restaurantWords = restaurantNameLower.split(' ');
      const hasSignificantMatch = restaurantWords.some(word => {
        // Match significant words (3+ chars, not common words)
        if (word.length < 3 || ['the', 'and', 'for', 'cafe', 'restaurant'].includes(word)) return false;
        return responseLower.includes(word);
      });
      
      return hasSignificantMatch;
    }) || [];
    
    console.log(`🔍 Found ${mentionedRestaurants.length} mentioned restaurants out of ${restaurants?.length || 0} total`);
    if (mentionedRestaurants.length > 0) {
      console.log(`🏪 Matched restaurants: ${mentionedRestaurants.map(r => r.name).join(', ')}`);
    }

    // Determine if user wants restaurants or specific dishes
    const wantsRestaurants = message.toLowerCase().includes('restaurant') || 
                            message.toLowerCase().includes('place') || 
                            message.toLowerCase().includes('where to eat') ||
                            message.toLowerCase().includes('show me');
    
    const wantsSpecificFood = message.toLowerCase().match(/\b(dessert|pizza|burger|sushi|pasta|noodles|curry|taco|salad|sandwich|breakfast|lunch|dinner)\b/);
    
    // Add restaurants as recommendations only if appropriate
    // Skip restaurant cards if user is asking for specific food items
    if (wantsRestaurants || !wantsSpecificFood) {
      mentionedRestaurants.slice(0, 3).forEach(restaurant => {
        const minOrder = parseFloat(restaurant.min_order) || 5;
        const prepTime = restaurant.avg_prep_time || '30-40 min';
        
        // Skip if restaurant min_order exceeds user budget
        if (userBudget && minOrder > userBudget) {
          console.log(`⚠️ Skipping restaurant ${restaurant.name} - min_order BD ${minOrder} exceeds budget BD ${userBudget}`);
          return;
        }
        
        console.log(`🏪 Adding restaurant: ${restaurant.name}, min_order: ${restaurant.min_order} → ${minOrder}, prep_time: ${prepTime}`);
        
        recommendations.push({
          id: restaurant.id,
          name: restaurant.name,
          restaurant: restaurant.name,
          restaurantId: restaurant.id,
          price: minOrder,
          image: restaurant.logo || restaurant.banner_image || '',
          rating: parseFloat(restaurant.rating) || 4.5,
          eta: prepTime,
          isRestaurant: true,
        });
      });
    } else {
      console.log(`📋 Skipping restaurant cards - user wants specific food items`);
    }

    // Find mentioned dishes - ONLY exact name matches or contextually relevant dishes
    const mentionedRestaurantIds = new Set(mentionedRestaurants.map(r => r.id));
    
    // Universal relevance scoring system - works for ALL query types
    const queryLower = message.toLowerCase();
    
    // Extract query intent comprehensively
    const queryIntent = {
      // Cuisine types
      italian: queryLower.includes('italian') || queryLower.includes('pasta') || queryLower.includes('pizza'),
      chinese: queryLower.includes('chinese') || queryLower.includes('fried rice') || queryLower.includes('noodles'),
      japanese: queryLower.includes('japanese') || queryLower.includes('sushi') || queryLower.includes('ramen'),
      mexican: queryLower.includes('mexican') || queryLower.includes('taco') || queryLower.includes('burrito'),
      indian: queryLower.includes('indian') || queryLower.includes('curry') || queryLower.includes('biryani'),
      thai: queryLower.includes('thai') || queryLower.includes('pad thai'),
      korean: queryLower.includes('korean') || queryLower.includes('bbq'),
      american: queryLower.includes('burger') || queryLower.includes('american'),
      arabic: queryLower.includes('arabic') || queryLower.includes('shawarma') || queryLower.includes('kebab'),
      
      // Meal types
      breakfast: queryLower.includes('breakfast'),
      lunch: queryLower.includes('lunch'),
      dinner: queryLower.includes('dinner'),
      dessert: queryLower.includes('dessert') || queryLower.includes('sweet') || queryLower.includes('cake') || queryLower.includes('ice cream'),
      snack: queryLower.includes('snack') || queryLower.includes('appetizer'),
      
      // Dietary
      vegetarian: queryLower.includes('vegetarian') || queryLower.includes('veggie'),
      vegan: queryLower.includes('vegan'),
      healthy: queryLower.includes('healthy') || queryLower.includes('light') || queryLower.includes('low calorie'),
      
      // Price
      budget: queryLower.includes('cheap') || queryLower.includes('budget') || userBudget,
      userBudget: userBudget,
      
      // Speed
      quick: queryLower.includes('quick') || queryLower.includes('fast'),
    };
    
    const mentionedDishes = dishes?.filter(dish => {
      const dishNameLower = dish.name.toLowerCase();
      const responseLower = aiResponse.toLowerCase();
      
      // PRIORITY 1: Exact dish name match in AI response - ALWAYS include
      if (responseLower.includes(dishNameLower)) return true;
      
      // PRIORITY 2: Contextually relevant dishes from mentioned restaurants
      if (mentionedRestaurantIds.size > 0 && mentionedRestaurantIds.has(dish.restaurant_id)) {
        
        // UNIVERSAL RELEVANCE CHECKS - Apply to ALL queries
        
        // 1. CUISINE TYPE MATCHING - If user asks for specific cuisine, ONLY show that cuisine
        const hasCuisineQuery = queryIntent.italian || queryIntent.chinese || queryIntent.japanese || 
                                queryIntent.mexican || queryIntent.indian || queryIntent.thai || 
                                queryIntent.korean || queryIntent.american || queryIntent.arabic;
        
        if (hasCuisineQuery) {
          const restaurantCuisine = dish.restaurants?.cuisine_types || [];
          const cuisineMatch = 
            (queryIntent.italian && restaurantCuisine.some(c => c.toLowerCase().includes('italian'))) ||
            (queryIntent.chinese && restaurantCuisine.some(c => c.toLowerCase().includes('chinese'))) ||
            (queryIntent.japanese && restaurantCuisine.some(c => c.toLowerCase().includes('japanese'))) ||
            (queryIntent.mexican && restaurantCuisine.some(c => c.toLowerCase().includes('mexican'))) ||
            (queryIntent.indian && restaurantCuisine.some(c => c.toLowerCase().includes('indian'))) ||
            (queryIntent.thai && restaurantCuisine.some(c => c.toLowerCase().includes('thai'))) ||
            (queryIntent.korean && restaurantCuisine.some(c => c.toLowerCase().includes('korean'))) ||
            (queryIntent.american && restaurantCuisine.some(c => c.toLowerCase().includes('american'))) ||
            (queryIntent.arabic && restaurantCuisine.some(c => c.toLowerCase().includes('arabic') || c.toLowerCase().includes('middle')));
          
          if (!cuisineMatch) return false; // Wrong cuisine type
        }
        
        // 2. MEAL TYPE MATCHING - If user asks for specific meal, ONLY show that meal type
        if (queryIntent.breakfast && !dish.meal_types?.includes('breakfast')) return false;
        if (queryIntent.lunch && !dish.meal_types?.includes('lunch') && !dish.meal_types?.includes('dinner')) return false;
        if (queryIntent.dinner && !dish.meal_types?.includes('dinner')) return false;
        if (queryIntent.snack && !dish.meal_types?.includes('snack') && !dish.meal_types?.includes('appetizer')) return false;
        
        // 3. DESSERT STRICT FILTERING - If user asks for dessert, ONLY show desserts
        if (queryIntent.dessert) {
          const isDessert = dish.meal_types?.includes('dessert') || 
                           dish.category?.toLowerCase().includes('dessert') ||
                           dish.category?.toLowerCase().includes('sweet');
          if (!isDessert) return false;
        }
        
        // 4. DIETARY RESTRICTIONS - Must match if specified
        if (queryIntent.vegetarian && !dish.is_vegetarian) return false;
        if (queryIntent.vegan && !dish.is_vegan) return false;
        
        // 5. HEALTHY FILTERING - Exclude unhealthy items
        if (queryIntent.healthy) {
          if (dish.price > 15) return false;
          if (dish.calories && dish.calories > 700) return false;
          if (!dish.dietary_tags?.some(tag => ['healthy', 'low-calorie', 'high-protein', 'grilled'].includes(tag))) {
            return false;
          }
        }
        
        // 6. BUDGET FILTERING - Respect price limits
        if (queryIntent.userBudget && dish.price > queryIntent.userBudget) return false;
        if (queryIntent.budget && dish.price > 10) return false;
        
        // 7. SPEED FILTERING - Check prep time
        if (queryIntent.quick && dish.preparation_time && dish.preparation_time > 20) return false;
        
        // 8. PRICE REASONABLENESS - For lunch/casual queries, exclude luxury items
        if ((queryIntent.lunch || queryIntent.quick) && dish.price > 20) return false;
        
        return true; // Passed all relevance checks
      }
      
      return false;
    }) || [];

    console.log(`🍽️ Found ${mentionedDishes.length} mentioned dishes`);

    // Add dishes as recommendations (prioritize exact matches, then dishes from mentioned restaurants)
    const exactMatches = mentionedDishes.filter(dish => 
      aiResponse.toLowerCase().includes(dish.name.toLowerCase())
    );
    const restaurantDishes = mentionedDishes.filter(dish => 
      !aiResponse.toLowerCase().includes(dish.name.toLowerCase()) &&
      mentionedRestaurantIds.has(dish.restaurant_id)
    );
    
    // Add exact matches first, then top-rated dishes from mentioned restaurants (filter by budget)
    [...exactMatches, ...restaurantDishes.sort((a, b) => (b.restaurants?.rating || 0) - (a.restaurants?.rating || 0))].slice(0, 5).forEach(dish => {
      const dishPrice = parseFloat(dish.price) || 0;
      
      // Skip if dish price exceeds user budget
      if (userBudget && dishPrice > userBudget) {
        console.log(`⚠️ Skipping dish ${dish.name} - price BD ${dishPrice} exceeds budget BD ${userBudget}`);
        return;
      }
      
      console.log(`🍽️ Adding dish: ${dish.name} from ${dish.restaurants?.name || 'Unknown'} (BD ${dishPrice}, restaurant_id: ${dish.restaurant_id})`);
      recommendations.push({
        id: dish.id,
        name: dish.name,
        restaurant: dish.restaurants?.name || 'Restaurant',
        restaurantId: dish.restaurant_id,
        price: dish.price,
        image: dish.image || '',
        rating: dish.restaurants?.rating || 4.5,
        eta: dish.restaurants?.avg_prep_time || '30-40 min',
      });
    });

    console.log(`📋 Returning ${recommendations.length} recommendations (${mentionedRestaurants.length} restaurants + ${Math.min(exactMatches.length + restaurantDishes.length, 5)} dishes)`);

    return {
      text: aiResponse,
      recommendations,
    };
  } catch (error: any) {
    console.error('❌ AI Service Error:', error);
    console.error('Error details:', {
      message: error?.message,
      status: error?.status,
      type: error?.type,
    });
    
    // Check if API key is missing
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      console.error('⚠️ OPENAI API KEY IS MISSING!');
      return {
        text: "⚠️ AI Assistant is not configured. Please add your OpenAI API key to the .env file.",
        recommendations: [],
      };
    }
    
    // Network error
    if (error?.message?.includes('Network request failed') || error?.message?.includes('fetch')) {
      return {
        text: "🔌 Network error. Please check your internet connection and try again.",
        recommendations: [],
      };
    }
    
    // API key error
    if (error?.status === 401 || error?.message?.includes('API key')) {
      return {
        text: "🔑 Invalid API key. Please check your OpenAI API key configuration.",
        recommendations: [],
      };
    }
    
    // Rate limit error
    if (error?.status === 429) {
      return {
        text: "⏱️ Too many requests. Please wait a moment and try again.",
        recommendations: [],
      };
    }
    
    // Generic fallback
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
