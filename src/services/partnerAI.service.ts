import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export interface RestaurantAnalytics {
  restaurant: any;
  orders: any[];
  dishes: any[];
  reviews: any[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generates business insights and answers questions for restaurant partners
 * using ChatGPT with real restaurant data
 */
export class PartnerAIService {
  
  /**
   * Sends a question to ChatGPT with restaurant context
   */
  static async askQuestion(
    question: string,
    analytics: RestaurantAnalytics,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Build context from restaurant data
      const context = this.buildRestaurantContext(analytics);
      
      // Prepare messages for ChatGPT
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are a professional business advisor and analytics assistant for restaurant partners. 
Your role is to help restaurant owners understand their business performance and make data-driven decisions.

${context}

Guidelines:
- Be concise and actionable
- Use specific numbers from the data
- Provide insights and recommendations
- Be friendly and professional
- Format numbers with BD currency (Bahraini Dinar)
- If asked about data you don't have, politely say so`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: question
        }
      ];

      // Call ChatGPT API
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Fast and cost-effective
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content || 'Sorry, I could not generate a response.';
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Builds context string from restaurant analytics data
   */
  private static buildRestaurantContext(analytics: RestaurantAnalytics): string {
    const { restaurant, orders, dishes, reviews } = analytics;

    // Calculate key metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Order status breakdown
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top dishes by order count
    const dishOrderCounts = orders.flatMap(o => o.order_items || [])
      .reduce((acc, item) => {
        const dishId = item.dish_id;
        acc[dishId] = (acc[dishId] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

    const topDishes = Object.entries(dishOrderCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([dishId, count]) => {
        const dish = dishes.find(d => d.id === dishId);
        return dish ? `${dish.name} (${count} orders)` : null;
      })
      .filter(Boolean);

    // Average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : restaurant.rating || 0;

    // Recent reviews sentiment
    const recentReviews = reviews.slice(0, 3).map(r => 
      `"${r.comment}" (${r.rating}⭐)`
    );

    // Build context string
    return `
RESTAURANT INFORMATION:
- Name: ${restaurant.name}
- Cuisine: ${restaurant.cuisine_types?.join(', ') || 'Not specified'}
- Location: ${restaurant.address || 'Not specified'}
- Average Rating: ${avgRating.toFixed(1)}⭐
- Total Menu Items: ${dishes.length}

BUSINESS METRICS:
- Total Orders: ${totalOrders}
- Total Revenue: BD ${totalRevenue.toFixed(2)}
- Average Order Value: BD ${avgOrderValue.toFixed(2)}
- Order Status: ${Object.entries(statusCounts).map(([status, count]) => `${status}: ${count}`).join(', ')}

TOP PERFORMING DISHES:
${topDishes.join('\n')}

RECENT CUSTOMER FEEDBACK:
${recentReviews.length > 0 ? recentReviews.join('\n') : 'No recent reviews'}

MENU OVERVIEW:
- Total Dishes: ${dishes.length}
- Price Range: BD ${Math.min(...dishes.map(d => d.price))} - BD ${Math.max(...dishes.map(d => d.price))}
`;
  }

  /**
   * Generates automated insights without a specific question
   */
  static async generateInsights(analytics: RestaurantAnalytics): Promise<string> {
    const question = `Based on my restaurant's current performance, what are the top 3 insights and recommendations you can provide?`;
    return this.askQuestion(question, analytics);
  }
}
