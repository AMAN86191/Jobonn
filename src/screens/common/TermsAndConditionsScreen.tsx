import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { FileText, ShieldAlert, Scale, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';

const TermsAndConditionsScreen = ({ navigation }: any) => {
  const sections = [
    {
      icon: FileText,
      title: '1. Introduction',
      content: 'Welcome to JobOnn. By accessing or using our mobile application and related recruitment services, you agree to comply with and be bound by these Terms and Conditions. Please review them carefully.',
    },
    {
      icon: CheckCircle2,
      title: '2. User Accounts & Eligibility',
      content: 'To use JobOnn, you must register for an account as either a Candidate or a Company Recruiter. You agree to provide accurate information and maintain the security of your password. You are responsible for all activities that occur under your account.',
    },
    {
      icon: Scale,
      title: '3. Platform Usage & Guidelines',
      content: 'Users must not upload false credentials, post illegal job listings, spam applicants, or scrape database profiles. JobOnn reserves the right to terminate accounts that violate our guidelines.',
    },
    {
      icon: ShieldAlert,
      title: '4. Packages, Payments & Refunds',
      content: 'Recruiters can purchase subscription packages (Starter, Growth, Pro) to post jobs and search candidate databases. All fees paid are non-refundable. Credits expire at the end of each billing cycle.',
    },
    {
      icon: AlertCircle,
      title: '5. Limitation of Liability',
      content: 'JobOnn acts as a venue for employers to post jobs and candidates to post resumes. We do not screen or censor the listings, and we are not liable for the actual transactions or hiring decisions made.',
    },
    {
      icon: HelpCircle,
      title: '6. Support & Contact Information',
      content: 'If you have any questions, concerns, or feedback regarding these terms, please contact our support team at support@jobonn.com.',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <CommanManagerHeader title="Terms & Conditions" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
          <Text style={styles.heroTitle}>Platform Terms & Agreements</Text>
          <Text style={styles.heroSubtitle}>Last Updated: June 18, 2026</Text>
          <Text style={styles.heroDesc}>
            Please read these terms carefully before using JobOnn. These govern your legal relationship with our recruitment platform.
          </Text>
        </Animated.View>

        {sections.map((sec, index) => {
          const IconComponent = sec.icon;
          return (
            <Animated.View
              key={index}
              entering={FadeInDown.duration(400).delay(100 + index * 50)}
              style={styles.sectionCard}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.iconCircle}>
                  <IconComponent size={RFValue(12)} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>{sec.title}</Text>
              </View>
              <Text style={styles.sectionContent}>{sec.content}</Text>
            </Animated.View>
          );
        })}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>© 2026 JobOnn Technologies Pvt Ltd.</Text>
          <Text style={styles.footerSubText}>All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: wp('3%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('5%'),
  },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTitle: {
    fontSize: RFValue(14),
    fontWeight: '800',
    color: Colors.white,
  },
  heroSubtitle: {
    fontSize: RFValue(8.5),
    color: 'rgba(255,255,255,0.7)',
    marginTop: hp('0.5%'),
    fontWeight: '600',
  },
  heroDesc: {
    fontSize: RFValue(9.2),
    color: 'rgba(255,255,255,0.9)',
    marginTop: hp('1.5%'),
    lineHeight: RFValue(13.5),
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('3%'),
    marginBottom: hp('1%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('1%'),
  },
  iconCircle: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('4%'),
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: RFValue(10.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionContent: {
    fontSize: RFValue(8.8),
    color: Colors.textSecondary,
    lineHeight: RFValue(13.5),
    fontWeight: '500',
    textAlign: 'justify',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  footerText: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: RFValue(7.5),
    color: Colors.textTertiary,
    marginTop: hp('0.3%'),
    fontWeight: '500',
  },
});

export default TermsAndConditionsScreen;
