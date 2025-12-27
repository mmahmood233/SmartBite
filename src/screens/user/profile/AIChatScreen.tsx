/**
 * AI Chat Screen - Wajba AI Food Assistant
 * Conversational interface for AI-powered food recommendations
 */// @ts-nocheck


import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { Feather as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { sendAIMessage, extractDishRecommendations } from '../../../services/ai.service';
import { supabase } from '../../../lib/supabase';
import DishDetailModal from '../restaurant/DishDetailModal';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCart } from '../../../contexts/CartContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  recommendations?: DishRecommendation[];
}

interface DishRecommendation {
  id: string;
  name: string;
  restaurant: string;
  restaurantId?: string;
  price: number;
  image: string;
  rating: number;
  eta: string;
  spicyLevel?: number;
  icon?: 'zap';
  isRestaurant?: boolean;
}

const AIChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useLanguage();
  const { addToCart: addToCartContext } = useCart();
  
  const QUICK_PROMPTS = [
    { id: '1', text: t('ai.quickPrompt1'), icon: 'flame' },
    { id: '2', text: t('ai.quickPrompt2'), icon: 'leaf' },
    { id: '3', text: t('ai.quickPrompt3'), icon: 'dollar-sign' },
    { id: '4', text: t('ai.quickPrompt4'), icon: 'heart' },
    { id: '5', text: t('ai.quickPrompt5'), icon: 'zap' },
  ];

  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: `${t('ai.greeting')}\n\n${t('ai.welcomeMessage')}`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [dishModalVisible, setDishModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  // Typing indicator animation
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: -10,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animateDot(dot1, 0);
      animateDot(dot2, 200);
      animateDot(dot3, 400);
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userMessageText = message.trim();
    setMessage('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Get user info for context
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

      // Call AI service
      const aiResult = await sendAIMessage(userMessageText, {
        userId: user?.id,
        userName: profile?.full_name || 'Guest',
        location: 'Bahrain',
      });

      // Extract dish recommendations from AI text
      const aiDishes = extractDishRecommendations(aiResult.text);
      console.log('🔍 Extracted dishes:', aiDishes.map(d => `${d.dishName} @ ${d.restaurantName}`).join(', '));

      // Query Supabase for exact dishes mentioned by AI
      let dishRecommendations: DishRecommendation[] = [];
      if (aiDishes.length > 0) {
        // Query each dish individually for exact matching
        const dishPromises = aiDishes.map(async ({ dishName, restaurantName }) => {
          // Try exact dish name match first
          let { data, error } = await supabase
            .from('dishes')
            .select(`
              id,
              name,
              price,
              image,
              is_available,
              restaurant_id,
              restaurants!inner(
                id,
                name
              )
            `)
            .eq('is_available', true)
            .ilike('name', dishName)
            .ilike('restaurants.name', `%${restaurantName.replace(' Bahrain', '')}%`)
            .limit(1)
            .single();

          // If exact match fails, try fuzzy match (contains)
          if (error || !data) {
            const fuzzyResult = await supabase
              .from('dishes')
              .select(`
                id,
                name,
                price,
                image,
                is_available,
                restaurant_id,
                restaurants!inner(
                  id,
                  name
                )
              `)
              .eq('is_available', true)
              .ilike('name', `%${dishName}%`)
              .ilike('restaurants.name', `%${restaurantName.replace(' Bahrain', '')}%`)
              .limit(1)
              .single();
            
            data = fuzzyResult.data;
            error = fuzzyResult.error;
          }

          return data;
        });

        const results = await Promise.all(dishPromises);
        const validDishes = results.filter(d => d !== null);

        if (validDishes.length > 0) {
          dishRecommendations = validDishes.map((d: any) => ({
            id: d.id,
            name: d.name,
            restaurant: d.restaurants.name,
            restaurantId: d.restaurant_id,
            price: d.price,
            image: d.image || '',
            rating: 4.5,
            eta: '20-30 mins',
            spicyLevel: 0,
          }));
          console.log('✅ Found exact dishes:', dishRecommendations.length);
          console.log('📋 Matched:', dishRecommendations.map(d => `${d.name} (${d.restaurant})`).join(', '));
        } else {
          console.log('⚠️ No exact matches found in database');
        }
      }

      // Create AI response message
      // Combine recommendations from both sources (old extraction + new JSON format)
      const allRecommendations = [...dishRecommendations, ...aiResult.recommendations];
      console.log(`💳 Total recommendations to display: ${allRecommendations.length}`);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: aiResult.text,
        timestamp: new Date(),
        recommendations: allRecommendations,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Error:', error);
      
      // Fallback error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: "Sorry, I'm having trouble connecting right now. Please try again! 🔄",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessage(promptText);
  };

  const handleOptionPress = async (title: string) => {
    try {
      // Try to find a matching restaurant by name
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name')
        .ilike('name', `%${title}%`)
        .limit(1)
        .maybeSingle();

      if (!error && data?.id) {
        navigation.navigate('RestaurantDetail', {
          restaurantId: data.id as string,
          restaurantName: data.name as string,
        });
        return;
      }
    } catch (err) {
      console.error('AI option navigation error:', err);
    }

    // Fallback: reuse as a quick prompt in the chat
    handleQuickPrompt(title);
  };

  const handleAddToCart = async (dish: DishRecommendation) => {
    try {
      console.log('Adding to cart:', dish);
      
      if (!dish.restaurantId) {
        Alert.alert('Error', 'Restaurant information is missing');
        return;
      }
      
      await addToCartContext(
        dish.id,
        dish.restaurantId,
        dish.restaurant,
        dish.name,
        dish.price,
        1, // quantity
        [], // addOns
        undefined, // specialRequest
        dish.image
      );
      
      Alert.alert('Success', `${dish.name} added to cart!`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', error.message || 'Failed to add to cart');
    }
  };

  const handleDishFromChatPress = async (dishName: string, restaurantName?: string) => {
    try {
      let query = supabase
        .from('dishes')
        .select('id, name, description, price, image, category, restaurant_id, restaurants(id, name)')
        .ilike('name', `%${dishName}%`)
        .limit(1);

      if (restaurantName) {
        // @ts-ignore – join alias typing
        query = query.ilike('restaurants.name', `%${restaurantName}%`);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        console.warn('Dish not found for AI chat:', error || dishName);
        return;
      }

      const menuItem = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category || 'Main',
        restaurant_id: data.restaurant_id,
        restaurants: {
          id: data.restaurants?.id || data.restaurant_id,
          name: data.restaurants?.name || restaurantName || 'Restaurant',
        },
      };

      setSelectedDish(menuItem);
      setDishModalVisible(true);
    } catch (err) {
      console.error('Error opening dish from AI chat:', err);
    }
  };

  const extractOptions = (text: string) => {
    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    return lines
      .map((line) => {
        const markdownMatch = line.match(/^\d+\.\s+\*\*([^*]+)\*\*/);
        const plainMatch = line.match(/^\d+\.\s+([^:]+)(?::|$)/);
        const dashMarkdownMatch = line.match(/^-\s+\*\*([^*]+)\*\*/);
        const dashPlainMatch = line.match(/^-\s+([^:]+)(?::|$)/);

        const title =
          markdownMatch?.[1] ||
          plainMatch?.[1] ||
          dashMarkdownMatch?.[1] ||
          dashPlainMatch?.[1];

        if (title) {
          return { title: title.trim(), raw: line };
        }
        return null;
      })
      .filter(Boolean) as { title: string; raw: string }[];
  };

  const renderMessage = (msg: Message) => {
    if (msg.type === 'user') {
      return (
        <View key={msg.id} style={styles.userMessageContainer}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{msg.text}</Text>
          </View>
        </View>
      );
    }

    // Use recommendations from AI service directly (no JSON parsing needed)
    // If we have recommendations, clean the text to remove numbered lists (they'll show as cards)
    let displayText = msg.text;
    const allRecommendations = msg.recommendations || [];
    
    if (allRecommendations.length > 0) {
      // Remove numbered list items (1., 2., 3., etc.) since they'll be shown as cards
      // Keep only the introductory text before the list
      const lines = displayText.split('\n');
      const cleanedLines = [];
      let foundList = false;
      
      for (const line of lines) {
        // Check if this line is a numbered list item
        if (line.match(/^\d+\.\s+\*\*/)) {
          foundList = true;
          continue; // Skip this line
        }
        // If we haven't found a list yet, or this is a non-list line after intro
        if (!foundList || line.trim() === '') {
          cleanedLines.push(line);
        }
      }
      
      displayText = cleanedLines.join('\n').trim();
    }
    
    const parsedOptions = extractOptions(msg.text); // Use original text for parsing options

    return (
      <View key={msg.id} style={styles.aiMessageContainer}>
        <View style={styles.aiAvatarContainer}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.aiAvatar}
          >
            <Text style={styles.aiAvatarText}>🤖</Text>
          </LinearGradient>
        </View>
        <View style={styles.aiContent}>
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>{displayText}</Text>
          </View>
          {parsedOptions.length > 0 && allRecommendations.length === 0 && (
            <View style={styles.optionChipsContainer}>
              {parsedOptions.map((opt, index) => (
                <TouchableOpacity
                  key={`${opt.title}-${index}`}
                  style={styles.optionChip}
                  onPress={() => handleOptionPress(opt.title)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.optionChipText}>{opt.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {allRecommendations && allRecommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              {allRecommendations.map((dish) => {
                // Check if this is a restaurant using the isRestaurant flag
                const isRestaurant = dish.isRestaurant === true;
                
                return (
                  <TouchableOpacity
                    key={dish.id}
                    style={styles.dishCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (isRestaurant && dish.restaurantId) {
                        // Navigate to restaurant detail
                        navigation.navigate('RestaurantDetail', {
                          restaurantId: dish.restaurantId,
                          restaurantName: dish.name,
                        });
                      } else {
                        // Open dish detail modal
                        handleDishFromChatPress(dish.name, dish.restaurant);
                      }
                    }}
                  >
                    {dish.image ? (
                      <Image
                        source={{ uri: dish.image }}
                        style={styles.dishImage}
                      />
                    ) : (
                      <View style={[styles.dishImage, { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }]}>
                        <Icon name="image" size={32} color="#9CA3AF" />
                      </View>
                    )}
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishName}>{dish.name}</Text>
                      {!isRestaurant && <Text style={styles.restaurantName}>{dish.restaurant}</Text>}
                      <View style={styles.dishMeta}>
                        <View style={styles.ratingContainer}>
                          <Icon name="star" size={14} color="#FFB800" />
                          <Text style={styles.rating}>{dish.rating}</Text>
                        </View>
                        <Text style={styles.eta}>• {dish.eta}</Text>
                      </View>
                      <View style={styles.dishFooter}>
                        <Text style={styles.price}>
                          {isRestaurant ? `Min BD ${dish.price.toFixed(2)}` : `BD ${dish.price.toFixed(2)}`}
                        </Text>
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            if (isRestaurant && dish.restaurantId) {
                              navigation.navigate('RestaurantDetail', {
                                restaurantId: dish.restaurantId,
                                restaurantName: dish.name,
                              });
                            } else {
                              handleAddToCart(dish);
                            }
                          }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={[colors.gradientStart, colors.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.addButtonGradient}
                          >
                            <Icon name={isRestaurant ? "arrow-right" : "plus"} size={16} color="#FFFFFF" />
                            <Text style={styles.addButtonText}>{isRestaurant ? "View" : "Add"}</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.aiMessageContainer}>
        <View style={styles.aiAvatarContainer}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.aiAvatar}
          >
            <Text style={styles.aiAvatarText}>🤖</Text>
          </LinearGradient>
        </View>
        <View style={styles.typingBubble}>
          <Animated.View
            style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]}
          />
          <Animated.View
            style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]}
          />
          <Animated.View
            style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Wajba AI 🍽️</Text>
          <Text style={styles.headerSubtitle}>Your Food Assistant</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {renderTypingIndicator()}
      </ScrollView>

      {/* Quick Prompts */}
      <ScrollView
        horizontal
        style={styles.quickPromptsContainer}
        contentContainerStyle={styles.quickPromptsContent}
        showsHorizontalScrollIndicator={false}
      >
        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt.id}
            style={styles.quickPromptChip}
            onPress={() => handleQuickPrompt(prompt.text)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickPromptText}>{prompt.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('ai.placeholder')}
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.voiceButton} activeOpacity={0.7}>
            <Icon name="mic" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              message.trim()
                ? [colors.gradientStart, colors.gradientEnd]
                : ['#E2E8F0', '#E2E8F0']
            }
            style={styles.sendButtonGradient}
          >
            <Icon name="send" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {selectedDish && (
        <DishDetailModal
          visible={dishModalVisible}
          onClose={() => setDishModalVisible(false)}
          dish={selectedDish}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
  },
  userBubble: {
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  userText: {
    fontSize: FONT_SIZE.base,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  aiAvatarContainer: {
    marginRight: SPACING.sm,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAvatarText: {
    fontSize: 20,
  },
  aiContent: {
    flex: 1,
  },
  aiBubble: {
    backgroundColor: '#F0F9F8',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
  },
  aiText: {
    fontSize: FONT_SIZE.base,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  typingBubble: {
    backgroundColor: '#F0F9F8',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  recommendationsContainer: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  dishCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dishImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E2E8F0',
  },
  dishInfo: {
    padding: SPACING.md,
  },
  dishName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  eta: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dishFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  optionChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  optionChipText: {
    color: colors.text,
    fontWeight: '600',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: 6,
  },
  addButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickPromptsContainer: {
    maxHeight: 50,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  quickPromptsContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  quickPromptChip: {
    backgroundColor: '#F0F9F8',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  quickPromptText: {
    fontSize: FONT_SIZE.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    minHeight: 44,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: colors.textPrimary,
    paddingVertical: SPACING.sm,
  },
  voiceButton: {
    padding: SPACING.sm,
  },
  sendButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIChatScreen;
