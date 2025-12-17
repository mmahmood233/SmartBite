import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'Orders',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time by going to the Orders tab. You\'ll see the current status and estimated delivery time.',
    },
    {
      id: '2',
      category: 'Orders',
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order before the restaurant confirms it. Go to Orders, select your order, and tap "Cancel Order".',
    },
    {
      id: '3',
      category: 'Orders',
      question: 'What if my order is late?',
      answer: 'If your order is significantly delayed, please contact our support team through the Help & Support section.',
    },
    {
      id: '4',
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, Apple Pay, and cash on delivery.',
    },
    {
      id: '5',
      category: 'Payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment information is encrypted and processed securely through Stripe.',
    },
    {
      id: '6',
      category: 'Delivery',
      question: 'What are the delivery fees?',
      answer: 'Delivery fees vary by restaurant and distance. You\'ll see the exact fee before placing your order.',
    },
    {
      id: '7',
      category: 'Delivery',
      question: 'Can I schedule a delivery?',
      answer: 'Currently, we only support immediate delivery. Scheduled delivery will be available soon.',
    },
    {
      id: '8',
      category: 'Account',
      question: 'How do I change my delivery address?',
      answer: 'Go to Profile > Addresses to add, edit, or delete delivery addresses.',
    },
    {
      id: '9',
      category: 'Account',
      question: 'How do I update my profile information?',
      answer: 'Go to Profile, tap on your name or email, and you can edit your information.',
    },
    {
      id: '10',
      category: 'General',
      question: 'Do you have minimum order requirements?',
      answer: 'Minimum order amounts vary by restaurant. You\'ll see the minimum order requirement on each restaurant\'s page.',
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderFAQ = (faq: FAQ) => {
    const isExpanded = expandedId === faq.id;

    return (
      <TouchableOpacity
        key={faq.id}
        style={styles.faqCard}
        onPress={() => toggleExpand(faq.id)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.primary}
          />
        </View>
        {isExpanded && (
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map(category => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {faqs
              .filter(faq => faq.category === category)
              .map(renderFAQ)}
          </View>
        ))}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
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
    paddingBottom: SPACING.lg,
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
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  categorySection: {
    marginBottom: SPACING.xl,
  },
  categoryTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: SPACING.md,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: SPACING.sm,
  },
  faqAnswer: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
    marginTop: SPACING.md,
    lineHeight: 20,
  },
});

export default FAQScreen;
