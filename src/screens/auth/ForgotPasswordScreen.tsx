import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ChevronLeft, Lock, X } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../../components/buttons/CustomButton';
import CustomInput from '../../components/inputs/CustomInput';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';
import OTPVerificationModal from '../../components/modals/OTPVerificationModal';
import { useDispatch } from 'react-redux';
import {
  ForgotPasswordSendOtpSlice,
  ForgotPasswordVerifyOtpSlice,
  ForgotPasswordResetPasswordSlice
} from '../../redux/AuthSlice';
import Toast from 'react-native-toast-message';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSend = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    try {
      setLoading(true);
      const res = await dispatch(
        ForgotPasswordSendOtpSlice({ email: email }) as any
      ).unwrap();
      console.log('Send OTP response:', res);

      if (res && (res.status === true || res.status_code === 200 || res.status === 'success')) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: res.message || 'OTP sent successfully to your email.',
        });
        setSent(true);
        setShowOtpModal(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: res?.message || 'Failed to send OTP',
        });
      }
    } catch (err: any) {
      console.log('Error sending OTP:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    try {
      setOtpLoading(true);
      const res = await dispatch(
        ForgotPasswordVerifyOtpSlice({
          email: email,
          otp: otpCode,
        }) as any
      ).unwrap();
      console.log('Verify OTP response:', res);

      const apiRes = res?.response || res;

      if (apiRes && (apiRes.status === true || apiRes.status_code === 200 || apiRes.status === 'success')) {
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: apiRes.message || 'OTP verified successfully.',
        });
        setShowOtpModal(false);
        // Wait for OTP modal close animation before opening Reset modal
        setTimeout(() => {
          setShowResetModal(true);
        }, 500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: apiRes?.message || 'Invalid OTP',
        });
      }
    } catch (err: any) {
      console.log('Error verifying OTP:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message || 'Failed to verify OTP',
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');

    try {
      setResetLoading(true);
      const res = await dispatch(
        ForgotPasswordResetPasswordSlice({
          email: email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }) as any
      ).unwrap();
      console.log('Reset password response:', res);

      const apiRes = res?.response || res;

      if (apiRes && (apiRes.status === true || apiRes.status_code === 200 || apiRes.status === 'success')) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: apiRes.message || 'Password reset successfully. Please sign in.',
        });
        setShowResetModal(false);
        // Reset states
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setSent(false);
        // Navigate back to Login screen
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: apiRes?.message || 'Failed to reset password',
        });
      }
    } catch (err: any) {
      console.log('Error resetting password:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message || 'Failed to reset password',
      });
    } finally {
      setResetLoading(false);
    }
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

          {/* OTP Verification Modal */}
          <OTPVerificationModal
            isVisible={showOtpModal}
            onClose={() => setShowOtpModal(false)}
            email={email}
            onVerify={handleVerifyOtp}
            loading={otpLoading}
            context="forgot"
            phone={email}
          />

          {/* Reset Password Modal */}
          <Modal
            visible={showResetModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowResetModal(false)}
          >
            <Pressable style={styles.overlay} onPress={() => setShowResetModal(false)}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
              >
                <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
                  <View style={styles.modalInner}>
                    <View style={styles.modalHeader}>
                      <View style={styles.indicator} />
                      <TouchableOpacity style={styles.closeBtn} onPress={() => setShowResetModal(false)}>
                        <X color={Colors.textSecondary} size={wp('5%')} />
                      </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                      <View style={styles.iconBoxModal}>
                        <Lock color={Colors.primary} size={wp('7%')} />
                      </View>

                      <Text style={styles.modalTitle}>Reset Password</Text>
                      <Text style={styles.modalSubtitle}>
                        Set a new password for{'\n'}
                        <Text style={styles.emailText}>{email}</Text>
                      </Text>

                      <View style={{ width: '100%', marginBottom: hp('2%') }}>
                        <CustomInput
                          label="New Password"
                          placeholder="••••••••"
                          secureTextEntry
                          value={newPassword}
                          onChangeText={setNewPassword}
                        />
                        <CustomInput
                          label="Confirm Password"
                          placeholder="••••••••"
                          secureTextEntry
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                        />
                      </View>

                      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                      <CustomButton
                        title="Reset Password"
                        onPress={handleResetPassword}
                        loading={resetLoading}
                      />
                    </ScrollView>
                  </View>
                </Pressable>
              </KeyboardAvoidingView>
            </Pressable>
          </Modal>
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

  // Modal Styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    paddingBottom: hp('2%'),
    maxHeight: hp('90%'),
  },
  modalInner: {
    paddingHorizontal: wp('6%'),
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  indicator: {
    width: wp('12%'),
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: hp('1%'),
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: hp('2%'),
    padding: wp('2%'),
  },
  modalScrollContent: {
    alignItems: 'center',
    paddingBottom: hp('2%'),
  },
  iconBoxModal: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  modalSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('2.5%'),
    marginBottom: hp('2%'),
  },
  emailText: { color: Colors.primary, fontWeight: '700' },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
});

export default ForgotPasswordScreen;
