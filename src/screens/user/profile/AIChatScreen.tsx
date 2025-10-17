/**
 * AI Chat Screen - Wajba AI Food Assistant
 * Conversational interface for AI-powered food recommendations
 */

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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';

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
  price: number;
  image: string;
  rating: number;
  eta: string;
  spicyLevel?: number;
}

const QUICK_PROMPTS = [
  { id: '1', text: 'I want something spicy 🌶️', icon: 'flame' },
  { id: '2', text: 'Show vegetarian meals 🥗', icon: 'leaf' },
  { id: '3', text: 'Cheap lunch near me 💸', icon: 'dollar-sign' },
  { id: '4', text: 'Healthy options 🥗', icon: 'heart' },
  { id: '5', text: 'Fast delivery ⚡', icon: 'zap' },
];

const AIChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "Hey! I'm Wajba AI 🤖\n\nTell me what you're craving, and I'll find the perfect meal for you! Try asking about spicy food, vegetarian options, or budget-friendly meals.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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
    setMessage('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: "Here are some great options for you! 🍽️",
        timestamp: new Date(),
        recommendations: [
          {
            id: '1',
            name: 'Shawarma Plate',
            restaurant: 'Shawarma House',
            price: 2.8,
            image: 'https://via.placeholder.com/150',
            rating: 4.5,
            eta: '20-30 min',
            spicyLevel: 2,
          },
          {
            id: '2',
            name: 'Spicy Mandi Rice',
            restaurant: 'Al Qariah',
            price: 2.9,
            image: 'https://via.placeholder.com/150',
            rating: 4.7,
            eta: '25-35 min',
            spicyLevel: 3,
          },
          {
            id: '3',
            name: 'Hot Fries Combo',
            restaurant: 'Snack Spot',
            price: 2.5,
            image: 'https://via.placeholder.com/150',
            rating: 4.3,
            eta: '15-25 min',
            spicyLevel: 1,
          },
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessage(promptText);
  };

  const handleAddToCart = (dish: DishRecommendation) => {
    // TODO: Add to cart logic
    console.log('Adding to cart:', dish);
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
            <Text style={styles.aiText}>{msg.text}</Text>
          </View>
          {msg.recommendations && msg.recommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              {msg.recommendations.map((dish) => (
                <View key={dish.id} style={styles.dishCard}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                  />
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.restaurantName}>{dish.restaurant}</Text>
                    <View style={styles.dishMeta}>
                      <View style={styles.ratingContainer}>
                        <Icon name="star" size={14} color="#FFB800" />
                        <Text style={styles.rating}>{dish.rating}</Text>
                      </View>
                      <Text style={styles.eta}>• {dish.eta}</Text>
                    </View>
                    <View style={styles.dishFooter}>
                      <Text style={styles.price}>BD {dish.price.toFixed(2)}</Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(dish)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[colors.gradientStart, colors.gradientEnd]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.addButtonGradient}
                        >
                          <Icon name="plus" size={16} color="#FFFFFF" />
                          <Text style={styles.addButtonText}>Add</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
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
            placeholder="Type your craving..."
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
