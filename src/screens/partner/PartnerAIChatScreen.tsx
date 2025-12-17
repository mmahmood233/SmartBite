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
import { PartnerAIService, ChatMessage } from '../../services/partnerAI.service';
import { useLanguage } from '../../contexts/LanguageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerAIChat'>;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function PartnerAIChatScreen({ navigation }: Props) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadRestaurantData();
    // Add welcome message
    addAIMessage(
      `${t('partner.aiGreeting')}\n\n${t('partner.analyticsStats')}\n${t('partner.marketingStrategies')}\n${t('partner.businessTips')}\n${t('partner.menuOptimization')}\n${t('partner.customerFeedback')}\n\n${t('partner.aiQuestion')}`
    );
  }, []);

  const loadRestaurantData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get restaurant data
      // @ts-ignore
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('partner_id', user.id)
        .single();

      if (restaurantError) {
        console.error('Error fetching restaurant:', restaurantError);
        return;
      }

      if (restaurant) {
        console.log('✅ Restaurant found:', restaurant.name);

        // Get order statistics with items
        // @ts-ignore
        const { data: orders } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('restaurant_id', restaurant.id);

        console.log('📦 Orders loaded:', orders?.length || 0);

        // Get menu items
        // @ts-ignore
        const { data: menuItems } = await supabase
          .from('dishes')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        console.log('🍽️ Menu items loaded:', menuItems?.length || 0);

        // Get reviews
        // @ts-ignore
        const { data: reviews } = await supabase
          .from('reviews')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        console.log('⭐ Reviews loaded:', reviews?.length || 0);

        const restaurantData = {
          restaurant,
          orders: orders || [],
          menuItems: menuItems || [],
          reviews: reviews || [],
        };

        setRestaurantData(restaurantData);
        console.log('✅ Restaurant data loaded successfully!');
      } else {
        console.log('❌ No restaurant found for this user');
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
    try {
      if (!restaurantData) {
        return "I'm still loading your restaurant data. Please wait a moment...";
      }

      // Build conversation history for context
      const conversationHistory: ChatMessage[] = messages
        .slice(-6) // Last 3 exchanges (6 messages)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      // Call ChatGPT with restaurant context
      const response = await PartnerAIService.askQuestion(
        userMessage,
        {
          restaurant: restaurantData.restaurant,
          orders: restaurantData.orders,
          dishes: restaurantData.menuItems,
          reviews: restaurantData.reviews
        },
        conversationHistory,
        language
      );

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please make sure you have an active internet connection and try again.";
    }
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
          <Text style={styles.headerTitle}>{t('partner.businessAssistant')}</Text>
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
            placeholder={t('partner.askAboutRestaurant')}
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
