import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SupportOption {
  id: string;
  icon: string;
  iconType: 'feather' | 'material';
  title: string;
  subtitle: string;
  action: () => void;
}

const HelpSupportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const handleChatSupport = () => {
    Alert.alert(
      'Chat Support',
      'Chat support will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handleCallSupport = async () => {
    const phoneNumber = '+97333560803';
    const url = `tel:${phoneNumber}`;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleEmailSupport = async () => {
    const email = 'support@wajba.bh';
    const url = `mailto:${email}`;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open email client');
    }
  };

  const handleFAQ = () => {
    Alert.alert(
      'FAQs',
      'Frequently Asked Questions page will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handleTerms = () => {
    Alert.alert(
      'Terms & Conditions',
      'Terms & Conditions page will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'Privacy Policy page will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const supportOptions: SupportOption[] = [
    {
      id: '1',
      icon: 'package',
      iconType: 'feather',
      title: 'Need help with an order?',
      subtitle: 'View your orders and get help',
      action: handleViewOrders,
    },
    {
      id: '2',
      icon: 'message-circle',
      iconType: 'feather',
      title: 'Chat with Support',
      subtitle: 'Get instant help from our team',
      action: handleChatSupport,
    },
    {
      id: '3',
      icon: 'phone',
      iconType: 'feather',
      title: 'Call Us',
      subtitle: '+973 3356 0803',
      action: handleCallSupport,
    },
    {
      id: '4',
      icon: 'mail',
      iconType: 'feather',
      title: 'Email Support',
      subtitle: 'support@wajba.bh',
      action: handleEmailSupport,
    },
    {
      id: '5',
      icon: 'help-circle',
      iconType: 'feather',
      title: 'FAQs',
      subtitle: 'Find answers to common questions',
      action: handleFAQ,
    },
    {
      id: '6',
      icon: 'file-text',
      iconType: 'feather',
      title: 'Terms & Conditions',
      subtitle: 'Read our terms of service',
      action: handleTerms,
    },
    {
      id: '7',
      icon: 'shield',
      iconType: 'feather',
      title: 'Privacy Policy',
      subtitle: 'Learn how we protect your data',
      action: handlePrivacy,
    },
  ];

  const renderSupportOption = (option: SupportOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={option.action}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        {option.iconType === 'feather' ? (
          <Icon name={option.icon} size={20} color={colors.primary} />
        ) : (
          <MaterialCommunityIcons name={option.icon} size={20} color={colors.primary} />
        )}
      </View>
      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Message */}
        <View style={styles.messageCard}>
          <View style={styles.messageIconContainer}>
            <MaterialCommunityIcons name="headset" size={32} color={colors.primary} />
          </View>
          <Text style={styles.messageTitle}>We're here to help!</Text>
          <Text style={styles.messageText}>
            Our support team is available 24/7 to assist you with any questions or concerns.
          </Text>
        </View>

        {/* Support Options */}
        <View style={styles.optionsContainer}>
          {supportOptions.map(renderSupportOption)}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Wajba v1.0.0</Text>
        </View>

        {/* Bottom Spacing */}
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
  },
  messageCard: {
    backgroundColor: colors.surface,
    margin: SPACING.lg,
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  messageIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  messageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  messageText: {
    fontSize: FONT_SIZE.base,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    padding: SPACING.lg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: '#64748B',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  versionText: {
    fontSize: FONT_SIZE.sm,
    color: '#94A3B8',
  },
});

export default HelpSupportScreen;
