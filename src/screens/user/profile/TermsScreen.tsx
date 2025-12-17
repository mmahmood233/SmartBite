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

const TermsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('partner.termsConditions')}</Text>
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

          <Text style={styles.sectionTitle}>{t('partner.acceptanceOfTerms')}</Text>
          <Text style={styles.paragraph}>
            {t('partner.acceptanceDesc')}
          </Text>

          <Text style={styles.sectionTitle}>{t('partner.useOfService')}</Text>
          <Text style={styles.paragraph}>
            {t('partner.useOfServiceDesc')}
          </Text>

          <Text style={styles.sectionTitle}>{t('partner.userAccounts')}</Text>
          <Text style={styles.paragraph}>
            {t('partner.userAccountsDesc')}
          </Text>

          <Text style={styles.sectionTitle}>{t('partner.ordersAndPayments')}</Text>
          <Text style={styles.paragraph}>
            {t('partner.ordersPaymentsDesc')}
          </Text>

          <Text style={styles.sectionTitle}>{t('partner.delivery')}</Text>
          <Text style={styles.paragraph}>
            {t('partner.deliveryDesc')}
          </Text>

          <Text style={styles.sectionTitle}>6. Cancellations and Refunds</Text>
          <Text style={styles.paragraph}>
            Orders can be cancelled before restaurant confirmation. Refunds are processed according to our refund policy. Wajba reserves the right to refuse refunds for orders that have been prepared or delivered.
          </Text>

          <Text style={styles.sectionTitle}>7. User Conduct</Text>
          <Text style={styles.paragraph}>
            You agree not to use the service to:
            {'\n'}• Violate any laws or regulations
            {'\n'}• Harass or harm other users
            {'\n'}• Submit false or misleading information
            {'\n'}• Interfere with the proper functioning of the service
          </Text>

          <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content on Wajba, including logos, text, images, and software, is the property of Wajba or its licensors and is protected by copyright and trademark laws.
          </Text>

          <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Wajba shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </Text>

          <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </Text>

          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
            {'\n'}Email: support@wajba.bh
            {'\n'}Phone: +973 3356 0803
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
    marginBottom: SPACING.xl,
    fontStyle: 'italic',
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
});

export default TermsScreen;
