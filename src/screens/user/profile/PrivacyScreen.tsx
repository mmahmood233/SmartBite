import React from 'react';
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
import { SPACING, BORDER_RADIUS, FONT_SIZE } from '../../../constants';
import { useLanguage } from '../../../contexts/LanguageContext';

const PrivacyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('partner.privacyPolicyTitle')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>{t('partner.lastUpdated')}: December 15, 2025</Text>

          <Text style={styles.intro}>
            {t('partner.privacyIntro')}
          </Text>

          <Text style={styles.sectionTitle}>{t('partner.infoWeCollect')}</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t('partner.personalInfo')}</Text> {t('partner.personalInfoDesc')}
            {'\n'}{t('partner.nameEmailPhone')}
            {'\n'}{t('partner.deliveryAddresses')}
            {'\n'}{t('partner.paymentInfo')}
            {'\n'}{t('partner.orderHistory')}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t('partner.autoCollectedInfo')}</Text>
            {'\n'}{t('partner.deviceInfo')}
            {'\n'}{t('partner.locationData')}
            {'\n'}{t('partner.usageData')}
            {'\n'}{t('partner.cookiesData')}
          </Text>

          <Text style={styles.sectionTitle}>{t('partner.howWeUse')}</Text>
          <Text style={styles.paragraph}>
            {t('partner.weUseInfoTo')}
            {'\n'}{t('partner.processOrders')}
            {'\n'}{t('partner.communicateWithYou')}
            {'\n'}{t('partner.improveServices')}
            {'\n'}{t('partner.sendPromotions')}
            {'\n'}{t('partner.preventFraud')}
            {'\n'}{t('partner.complyLegal')}
          </Text>

          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We may share your information with:
            {'\n'}• Restaurants to fulfill your orders
            {'\n'}• Delivery partners for order delivery
            {'\n'}• Payment processors for secure transactions
            {'\n'}• Service providers who assist our operations
            {'\n'}• Law enforcement when required by law
          </Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information to third parties.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your information:
            {'\n'}• Encryption of sensitive data
            {'\n'}• Secure payment processing through Stripe
            {'\n'}• Regular security audits
            {'\n'}• Access controls and authentication
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
            {'\n'}• Access your personal information
            {'\n'}• Correct inaccurate data
            {'\n'}• Request deletion of your data
            {'\n'}• Opt-out of marketing communications
            {'\n'}• Withdraw consent for data processing
          </Text>

          <Text style={styles.sectionTitle}>6. Location Data</Text>
          <Text style={styles.paragraph}>
            We use your location to:
            {'\n'}• Show nearby restaurants
            {'\n'}• Provide accurate delivery estimates
            {'\n'}• Improve service recommendations
            {'\n\n'}You can disable location services in your device settings at any time.
          </Text>

          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our service is not intended for children under 13. We do not knowingly collect information from children under 13.
          </Text>

          <Text style={styles.sectionTitle}>8. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account at any time.
          </Text>

          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
          </Text>

          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this Privacy Policy, please contact us:
            {'\n\n'}Email: support@wajba.bh
            {'\n'}Phone: +973 3356 0803
            {'\n'}Address: Manama, Kingdom of Bahrain
          </Text>
        </View>

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
  content: {
    padding: SPACING.lg,
  },
  lastUpdated: {
    fontSize: FONT_SIZE.sm,
    color: '#94A3B8',
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: FONT_SIZE.base,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontSize: FONT_SIZE.base,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  bold: {
    fontWeight: '600',
    color: '#0F172A',
  },
});

export default PrivacyScreen;
