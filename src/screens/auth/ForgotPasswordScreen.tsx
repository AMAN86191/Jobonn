import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../../components/buttons/CustomButton';
import CustomInput from '../../components/inputs/CustomInput';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';
import OTPVerificationModal from '../../components/modals/OTPVerificationModal';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);


  const handleSend = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  const handleVerifyOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setShowOtpModal(false);
      navigation.replace('ResetPassword');
    }, 1500);
  };


  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <ChevronLeft color={Colors.textPrimary} size={wp('6%')} />
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🔒</Text>
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email and we'll send you a code to reset your password.
          </Text>

          {sent ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>✉️</Text>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successSubtitle}>
                We sent a reset OTP to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <CustomButton
                title="Verify OTP"
                onPress={() => setShowOtpModal(true)}
              />

            </View>
          ) : (
            <View style={styles.card}>
              <CustomInput
                label="Email Address"
                placeholder="you@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={emailError}
              />
              <CustomButton title="Send Reset Code" onPress={handleSend} loading={loading} />
            </View>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back to Sign In</Text>
          </TouchableOpacity>

          <OTPVerificationModal
            isVisible={showOtpModal}
            onClose={() => setShowOtpModal(false)}
            email={email}
            onVerify={handleVerifyOtp}
            loading={otpLoading}
            context="forgot"
          />
        </ScrollView>

      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: wp('2%'),
    paddingTop: hp('6%'),
    paddingBottom: hp('4%'),
    alignItems: 'center',
  },
  backBtn: {
    width: wp('10%'), height: wp('10%'), borderRadius: wp('5%'),
    backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, alignSelf: 'flex-start', marginBottom: hp('3%'),
  },
  iconBox: {
    width: wp('20%'), height: wp('20%'), borderRadius: wp('6%'),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: hp('2.5%'),
  },
  iconEmoji: { fontSize: wp('9%') },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: hp('1%'), textAlign: 'center' },
  subtitle: {
    ...Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: hp('2.8%'), marginBottom: hp('3.5%'),
  },
  card: {
    backgroundColor: Colors.white, borderRadius: wp('5%'),
    padding: wp('5%'), width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: hp('0.3%') },
    shadowOpacity: 0.05, shadowRadius: wp('2%'), elevation: 2, marginBottom: hp('2.5%'),
    opacity: 0.8
  },
  successCard: {
    backgroundColor: Colors.white, borderRadius: wp('5%'),
    padding: wp('6%'), width: '100%', alignItems: 'center', marginBottom: hp('2.5%'),
    shadowColor: '#000', shadowOffset: { width: 0, height: hp('0.3%') },
    shadowOpacity: 0.05, shadowRadius: wp('2%'), elevation: 2,
    opacity: 0.8
  },
  successEmoji: { fontSize: wp('12%'), marginBottom: hp('2%') },
  successTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: hp('1%') },
  successSubtitle: {
    ...Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: hp('2.8%'), marginBottom: hp('3%'),
  },
  emailHighlight: { color: Colors.primary, fontWeight: '700' },
  backText: { ...Typography.caption, color: Colors.primary, fontWeight: '600', marginTop: hp('2%') },
});

export default ForgotPasswordScreen;
