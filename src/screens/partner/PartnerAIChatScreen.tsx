/**
 * Partner AI Chat - Restaurant Business Assistant
 * Helps partners with marketing, analytics, and business insights
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerAIChat'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function PartnerAIChatScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadRestaurantData();
    // Add welcome message
    addAIMessage(
      "👋 Hello! I'm your restaurant business assistant. I can help you with:\n\n" +
      "📊 Analytics & Statistics\n" +
      "📈 Marketing Strategies\n" +
      "💡 Business Improvement Tips\n" +
      "📋 Menu Optimization\n" +
      "⭐ Customer Feedback Analysis\n\n" +
      "What would you like to know about your restaurant?"
    );
  }, []);

  const loadRestaurantData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get restaurant data
      // @ts-ignore
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*, users!restaurants_owner_id_fkey(full_name)')
        .eq('owner_id', user.id)
        .single();

      if (restaurant) {
        // Get order statistics
        // @ts-ignore
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        // Get menu items
        // @ts-ignore
        const { data: menuItems } = await supabase
          .from('dishes')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        // Get reviews
        // @ts-ignore
        const { data: reviews } = await supabase
          .from('reviews')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        setRestaurantData({
          restaurant,
          orders: orders || [],
          menuItems: menuItems || [],
          reviews: reviews || [],
        });
      }
    } catch (error) {
      console.error('Error loading restaurant data:', error);
    }
  };

  const addAIMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Analytics & Statistics
    if (lowerMessage.includes('statistic') || lowerMessage.includes('analytics') || lowerMessage.includes('performance')) {
      return generateStatisticsResponse();
    }

    // Marketing
    if (lowerMessage.includes('market') || lowerMessage.includes('promote') || lowerMessage.includes('advertis')) {
      return generateMarketingResponse();
    }

    // Menu optimization
    if (lowerMessage.includes('menu') || lowerMessage.includes('dish') || lowerMessage.includes('item')) {
      return generateMenuResponse();
    }

    // Customer feedback
    if (lowerMessage.includes('review') || lowerMessage.includes('feedback') || lowerMessage.includes('rating')) {
      return generateFeedbackResponse();
    }

    // Improvement tips
    if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('tips')) {
      return generateImprovementResponse();
    }

    // Revenue
    if (lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('earning')) {
      return generateRevenueResponse();
    }

    // Default response
    return "I can help you with:\n\n" +
      "📊 **Statistics**: Ask about your performance metrics\n" +
      "📈 **Marketing**: Get promotion and advertising tips\n" +
      "📋 **Menu**: Optimize your menu items\n" +
      "⭐ **Reviews**: Analyze customer feedback\n" +
      "💡 **Improvements**: Get actionable business tips\n" +
      "💰 **Revenue**: Understand your earnings\n\n" +
      "Try asking something like 'Show me my statistics' or 'How can I improve my marketing?'";
  };

  const generateStatisticsResponse = (): string => {
    if (!restaurantData) return "Loading your restaurant data...";

    const { orders, reviews, restaurant } = restaurantData;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
    const avgRating = restaurant.rating || 0;
    const totalReviews = reviews.length;

    const today = new Date();
    const thisMonth = orders.filter((o: any) => {
      const orderDate = new Date(o.created_at);
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    });

    return `📊 **Your Restaurant Statistics**\n\n` +
      `**Overall Performance:**\n` +
      `• Total Orders: ${totalOrders}\n` +
      `• Total Revenue: BHD ${totalRevenue.toFixed(3)}\n` +
      `• Average Rating: ${avgRating.toFixed(1)} ⭐\n` +
      `• Total Reviews: ${totalReviews}\n\n` +
      `**This Month:**\n` +
      `• Orders: ${thisMonth.length}\n` +
      `• Revenue: BHD ${thisMonth.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0).toFixed(3)}\n\n` +
      `💡 **Insight**: ${totalOrders > 0 ? 
        `You're averaging ${(totalRevenue / totalOrders).toFixed(3)} BHD per order.` : 
        'Start accepting orders to see your performance metrics!'}`;
  };

  const generateMarketingResponse = (): string => {
    if (!restaurantData) return "Loading your restaurant data...";

    const { restaurant, orders } = restaurantData;
    const rating = restaurant.rating || 0;

    return `📈 **Marketing Strategy Recommendations**\n\n` +
      `**1. Leverage Your Strengths:**\n` +
      `${rating >= 4.0 ? 
        `✅ Your ${rating.toFixed(1)}⭐ rating is excellent! Promote this in your marketing.` :
        `⚠️ Focus on improving your rating to 4.0+ before heavy marketing.`}\n\n` +
      `**2. Social Media Tips:**\n` +
      `• Post high-quality food photos daily\n` +
      `• Share customer reviews and testimonials\n` +
      `• Run limited-time offers (e.g., "20% off this weekend")\n` +
      `• Use local hashtags (#BahrainFood #ManamaCafe)\n\n` +
      `**3. Promotions That Work:**\n` +
      `• First-time customer discount (15-20%)\n` +
      `• Loyalty program (Buy 5, get 1 free)\n` +
      `• Bundle deals (Meal + Drink combos)\n` +
      `• Happy hour specials\n\n` +
      `**4. Partner with Influencers:**\n` +
      `• Reach out to local food bloggers\n` +
      `• Offer complimentary meals for reviews\n` +
      `• Collaborate on giveaways\n\n` +
      `💡 **Quick Win**: Create a "Special of the Day" to encourage repeat visits!`;
  };

  const generateMenuResponse = (): string => {
    if (!restaurantData) return "Loading your restaurant data...";

    const { menuItems, orders } = restaurantData;
    const totalItems = menuItems.length;

    // Calculate popular items from orders
    const itemSales: { [key: string]: number } = {};
    orders.forEach((order: any) => {
      // This would need order_items data in real implementation
    });

    return `📋 **Menu Optimization Tips**\n\n` +
      `**Current Menu:**\n` +
      `• Total Items: ${totalItems}\n` +
      `• Categories: ${new Set(menuItems.map((item: any) => item.category)).size}\n\n` +
      `**Recommendations:**\n\n` +
      `**1. Menu Size:**\n` +
      `${totalItems < 10 ? 
        `⚠️ Consider adding more variety (aim for 15-25 items)` :
        totalItems > 50 ?
        `⚠️ Too many items can overwhelm customers. Focus on your best sellers.` :
        `✅ Good menu size! Keep it focused on quality.`}\n\n` +
      `**2. Pricing Strategy:**\n` +
      `• Use psychological pricing (BHD 2.990 instead of BHD 3.000)\n` +
      `• Offer items at different price points\n` +
      `• Create premium and budget options\n\n` +
      `**3. Menu Engineering:**\n` +
      `• Highlight high-profit items with boxes/icons\n` +
      `• Use appetizing descriptions\n` +
      `• Add photos to top sellers\n` +
      `• Group items strategically\n\n` +
      `**4. Seasonal Updates:**\n` +
      `• Rotate 2-3 items quarterly\n` +
      `• Add seasonal specials\n` +
      `• Test new items as "Limited Time Only"\n\n` +
      `💡 **Pro Tip**: Your most profitable items should be in the top-right of your menu!`;
  };

  const generateFeedbackResponse = (): string => {
    if (!restaurantData) return "Loading your restaurant data...";

    const { reviews, restaurant } = restaurantData;
    const totalReviews = reviews.length;
    const avgRating = restaurant.rating || 0;

    const ratingDistribution = {
      5: reviews.filter((r: any) => r.rating === 5).length,
      4: reviews.filter((r: any) => r.rating === 4).length,
      3: reviews.filter((r: any) => r.rating === 3).length,
      2: reviews.filter((r: any) => r.rating === 2).length,
      1: reviews.filter((r: any) => r.rating === 1).length,
    };

    return `⭐ **Customer Feedback Analysis**\n\n` +
      `**Overall Rating: ${avgRating.toFixed(1)}/5.0**\n` +
      `Total Reviews: ${totalReviews}\n\n` +
      `**Rating Distribution:**\n` +
      `⭐⭐⭐⭐⭐ ${ratingDistribution[5]} (${totalReviews > 0 ? ((ratingDistribution[5]/totalReviews)*100).toFixed(0) : 0}%)\n` +
      `⭐⭐⭐⭐ ${ratingDistribution[4]} (${totalReviews > 0 ? ((ratingDistribution[4]/totalReviews)*100).toFixed(0) : 0}%)\n` +
      `⭐⭐⭐ ${ratingDistribution[3]} (${totalReviews > 0 ? ((ratingDistribution[3]/totalReviews)*100).toFixed(0) : 0}%)\n` +
      `⭐⭐ ${ratingDistribution[2]} (${totalReviews > 0 ? ((ratingDistribution[2]/totalReviews)*100).toFixed(0) : 0}%)\n` +
      `⭐ ${ratingDistribution[1]} (${totalReviews > 0 ? ((ratingDistribution[1]/totalReviews)*100).toFixed(0) : 0}%)\n\n` +
      `**Action Items:**\n` +
      `${avgRating >= 4.5 ? 
        `✅ Excellent! Maintain quality and respond to all reviews.` :
        avgRating >= 4.0 ?
        `📈 Good rating. Focus on addressing negative feedback.` :
        avgRating >= 3.0 ?
        `⚠️ Needs improvement. Analyze low ratings and fix issues.` :
        `🚨 Critical: Immediate action needed to improve service quality.`}\n\n` +
      `**Best Practices:**\n` +
      `• Respond to ALL reviews within 24 hours\n` +
      `• Thank positive reviewers\n` +
      `• Address complaints professionally\n` +
      `• Offer solutions to unhappy customers\n` +
      `• Use feedback to improve operations\n\n` +
      `💡 **Tip**: Customers who receive responses are 3x more likely to return!`;
  };

  const generateImprovementResponse = (): string => {
    if (!restaurantData) return "Loading your restaurant data...";

    const { restaurant, orders, reviews } = restaurantData;
    const rating = restaurant.rating || 0;
    const totalOrders = orders.length;

    return `💡 **Business Improvement Recommendations**\n\n` +
      `**Priority Actions:**\n\n` +
      `**1. Service Quality** ${rating >= 4.0 ? '✅' : '⚠️'}\n` +
      `${rating >= 4.0 ? 
        '• Maintain current standards\n• Train staff on consistency' :
        '• Conduct staff training sessions\n• Implement quality checks\n• Gather customer feedback'}\n\n` +
      `**2. Order Volume** ${totalOrders >= 50 ? '✅' : '📈'}\n` +
      `${totalOrders >= 50 ?
        '• Focus on customer retention\n• Upsell and cross-sell' :
        '• Increase marketing efforts\n• Run promotional campaigns\n• Improve visibility'}\n\n` +
      `**3. Operational Efficiency:**\n` +
      `• Optimize prep times (target: <15 min)\n` +
      `• Streamline order workflow\n` +
      `• Use prep lists for busy hours\n` +
      `• Monitor delivery times\n\n` +
      `**4. Customer Experience:**\n` +
      `• Ensure accurate orders (check before sending)\n` +
      `• Proper packaging (prevent spills)\n` +
      `• Include utensils and napkins\n` +
      `• Add a thank you note\n\n` +
      `**5. Technology:**\n` +
      `• Keep menu updated and accurate\n` +
      `• Upload high-quality food photos\n` +
      `• Enable real-time order tracking\n` +
      `• Use analytics to make decisions\n\n` +
      `**6. Financial Management:**\n` +
      `• Track food costs (aim for 28-35%)\n` +
      `• Monitor waste and spoilage\n` +
      `• Optimize portion sizes\n` +
      `• Review pricing quarterly\n\n` +
      `💡 **Quick Win**: Focus on one area this week and measure results!`;
  };

  const generateRevenueResponse = (): string => {
    if (!restaurantData) return "Loading your restaurant data...";

    const { orders } = restaurantData;
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const today = new Date();
    const thisMonth = orders.filter((o: any) => {
      const orderDate = new Date(o.created_at);
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    });
    const monthRevenue = thisMonth.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

    const lastMonth = orders.filter((o: any) => {
      const orderDate = new Date(o.created_at);
      const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return orderDate.getMonth() === lastMonthDate.getMonth() && orderDate.getFullYear() === lastMonthDate.getFullYear();
    });
    const lastMonthRevenue = lastMonth.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

    const growth = lastMonthRevenue > 0 ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

    return `💰 **Revenue Analysis**\n\n` +
      `**All-Time:**\n` +
      `• Total Revenue: BHD ${totalRevenue.toFixed(3)}\n` +
      `• Total Orders: ${totalOrders}\n` +
      `• Average Order Value: BHD ${avgOrderValue.toFixed(3)}\n\n` +
      `**This Month:**\n` +
      `• Revenue: BHD ${monthRevenue.toFixed(3)}\n` +
      `• Orders: ${thisMonth.length}\n` +
      `• Growth: ${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs last month\n\n` +
      `**Revenue Optimization Tips:**\n\n` +
      `**1. Increase Average Order Value:**\n` +
      `• Suggest add-ons (drinks, sides, desserts)\n` +
      `• Create combo meals\n` +
      `• Offer free delivery over BHD 10\n` +
      `• Bundle popular items\n\n` +
      `**2. Boost Order Frequency:**\n` +
      `• Loyalty rewards program\n` +
      `• Weekly specials\n` +
      `• Email marketing to past customers\n` +
      `• Limited-time offers\n\n` +
      `**3. Reduce Costs:**\n` +
      `• Negotiate with suppliers\n` +
      `• Minimize food waste\n` +
      `• Optimize portion sizes\n` +
      `• Track inventory closely\n\n` +
      `**4. Expand Revenue Streams:**\n` +
      `• Catering services\n` +
      `• Meal subscriptions\n` +
      `• Corporate lunch programs\n` +
      `• Special event packages\n\n` +
      `💡 **Target**: Aim to increase average order value by 15% this quarter!`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addUserMessage(userMessage);
    setLoading(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await generateAIResponse(userMessage);
      addAIMessage(response);
    } catch (error) {
      addAIMessage("I apologize, but I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';
    return (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          isAI ? styles.aiMessage : styles.userMessage,
        ]}
      >
        {isAI && (
          <View style={styles.aiIcon}>
            <Icon name="cpu" size={20} color="#fff" />
          </View>
        )}
        <View style={[styles.messageContent, isAI ? styles.aiContent : styles.userContent]}>
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {message.text}
          </Text>
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Icon name="cpu" size={24} color="#00A86B" />
          <Text style={styles.headerTitle}>Business Assistant</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#00A86B" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about your restaurant..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  aiContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  userContent: {
    backgroundColor: '#00A86B',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  aiText: {
    color: '#000',
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A86B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
