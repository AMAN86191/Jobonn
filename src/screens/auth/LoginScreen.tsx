import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../../components/buttons/CustomButton';
import CustomInput from '../../components/inputs/CustomInput';
import Divider from '../../components/typography/Divider';
import SocialLoginButton from '../../components/buttons/SocialLoginButton';
import { Briefcase } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';
import OTPVerificationModal from '../../components/modals/OTPVerificationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { LoginSlice } from '../../redux/AuthSlice';
import Toast from 'react-native-toast-message';
import { candidateProfile, recruiterProfile } from '../../data/jobonnStaticData';
import { getProfileCompleteness } from '../../utils/profileCompleteness';



type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const role = route.params?.role ?? 'candidate';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');


  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (rememberMe) {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    } else {
      checkScale.value = withTiming(0, { duration: 150 });
    }
  }, [rememberMe]);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const validateEmail = () => {
    let valid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else setEmailError('');
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else setPasswordError('');
    return valid;
  };

  const validatePhone = () => {
    let valid = true;
    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      valid = false;
    } else setPhoneError('');
    return valid;
  };

  const handleLogin = async () => {
    if (loginMethod === 'phone') {
      if (!validatePhone()) return;
      try {
        setLoading(true);
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
        setShowOtpModal(true);
      } catch (error: any) {
        setPhoneError(error?.message || 'Unable to start mock OTP login');
      } finally {
        setLoading(false);
      }
    } else {
      if (!validateEmail()) return;
      try {
        setLoading(true);
        const payload = {
          email: email,
          password: password,
        };
        const res = await dispatch(LoginSlice(payload) as any).unwrap();
        console.log('Login response:', res);

        if (res?.status === false || res?.status_code === 401) {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: res?.message || 'Invalid credentials.',
          });
          return;
        }

        if (res?.token) {
          await AsyncStorage.setItem('userToken', res.token);
        }
        if (res?.company) {
          const completeness = getProfileCompleteness(res.company);
          const userData = {
            ...(res.user || {}),
            company: res.company,
            profile_completed: completeness.isComplete,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } else if (res?.candidate || res?.user?.candidate || res?.user?.role === 'candidate' || res?.role === 'candidate') {
          const candObj = res.candidate || res.user?.candidate;
          const userData = {
            ...(res.user || {}),
            candidate: candObj,
            role: 'candidate',
            profile_completed: !!(candObj?.designation || candObj?.profile_summery || candObj?.profile_summary),
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } else if (res?.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(res.user));
        }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: res?.message || 'Welcome back!',
        });

        const userRole = res?.role || res?.user?.role || role;
        if (userRole === 'candidate') {
          navigation.replace('CandidateHome');
        } else {
          navigation.replace('ManagerHome');
        }
      } catch (error: any) {
        console.error('Login error:', error);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error?.message || 'Invalid email or password.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const staticUser = role === 'candidate' ? candidateProfile : recruiterProfile;
    try {
      setOtpLoading(true);
      setOtpError('');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      if (otp.length < 4) {
        throw new Error('Enter any 4 digit mock OTP');
      }
      await AsyncStorage.setItem('userToken', 'static-front-end-token');
      await AsyncStorage.setItem('userData', JSON.stringify(staticUser));
      setShowOtpModal(false);

      ToastAndroid.show('Static login successful!', ToastAndroid.SHORT);
      if (staticUser.role === 'candidate') navigation.replace('CandidateHome');
      else navigation.replace('ManagerHome');

    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Invalid OTP';
      setOtpError(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppBackground>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header - Animated */}
          <View
            style={styles.header}
          >
            <View style={styles.logoMini}>
              <Briefcase color={Colors.white} size={wp('8%')} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your JobON account</Text>
          </View>

          {/* Form Card - Animated */}
          <View

            style={styles.card}
          >
            {loginMethod === 'phone' ? (
              <CustomInput
                label="Phone Number"
                placeholder="Enter your 10-digit mobile number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                error={phoneError}
                maxLength={13}
              />
            ) : (
              <>
                <CustomInput
                  label="Email Address"
                  placeholder="Enter Your Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  error={emailError}
                />
                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                  error={passwordError}
                />
              </>
            )}

            {/* Remember Me + Forgot */}

            {loginMethod === 'email' && (
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}


            <CustomButton
              title={loginMethod === 'phone' ? "Send OTP" : "Sign In"}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.switchMethodBtn}
              onPress={() => {
                setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
                setPhoneError('');
                setEmailError('');
                setPasswordError('');
              }}
            >
              <Text style={styles.switchMethodText}>
                {loginMethod === 'phone' ? 'Continue with Email' : 'Sign in with Phone Number'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Login - Animated */}
          <View>
            <Divider label="Continue with" />
            <View style={styles.socialRow}>
              <SocialLoginButton type="google" onPress={() => { }} />
              <SocialLoginButton type="linkedin" onPress={() => { }} />
            </View>
          </View>

          <View>
            <TouchableOpacity onPress={() => navigation.navigate('RoleSelection', { fromSignup: true })}>
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupLink}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Hint for Testing */}
          <View

            style={styles.hintCard}
          >
            <View style={styles.hintHeader}>
              <View style={styles.hintDot} />
              <Text style={styles.hintTitle}>Testing Guide</Text>
            </View>
            <View style={styles.testBtnRow}>
              <TouchableOpacity
                style={[styles.testBtn, { backgroundColor: Colors.primary }]}
                onPress={() => navigation.navigate('CandidateHome')}
              >
                <Text style={styles.testBtnText}>View Candidate UI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.testBtn, { backgroundColor: Colors.secondary }]}
                onPress={() => navigation.navigate('ManagerHome')}
              >
                <Text style={styles.testBtnText}>View Manager UI</Text>
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>
      </AppBackground>

      <OTPVerificationModal
        isVisible={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={phone}
        phone={phone}
        onVerify={handleVerifyOtp}
        loading={otpLoading}
        externalError={otpError}
        context="login"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('7%'),
    paddingBottom: hp('4%'),
  },
  header: { alignItems: 'center', marginBottom: hp('3.5%') },
  logoMini: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoLetter: { ...Typography.h1, color: Colors.white, fontWeight: '800' },
  title: { ...Typography.h2, marginBottom: hp('0.3%') },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary },

  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('6%'),
    padding: wp('5%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
    marginBottom: hp('2%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  checkRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('1.5%'),
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkMark: { color: Colors.white, fontWeight: '800' },
  rememberText: { ...Typography.caption, color: Colors.textSecondary },
  forgotText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },

  socialRow: { flexDirection: 'row', gap: wp('3%'), marginBottom: hp('2.5%') },

  switchMethodBtn: { marginTop: hp('2%'), alignItems: 'center' },
  switchMethodText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },

  signupText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  signupLink: { color: Colors.primary, fontWeight: '700' },
  hintCard: {
    marginTop: hp('4%'),
    backgroundColor: Colors.primary + '10',
    padding: wp('4%'),
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
    gap: wp('2%'),
  },
  hintDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.primary,
  },
  hintTitle: {
    ...Typography.caption,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  hintText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
  },
  hintSubText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: hp('2%'),
  },
  changeRoleBtn: {
    marginTop: hp('1.5%'),
    backgroundColor: Colors.primary,
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  changeRoleText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },
  testBtnRow: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginTop: hp('1.5%'),
  },
  testBtn: {
    flex: 1,
    paddingVertical: hp('1%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testBtnText: {
    ...Typography.caption,
    color: Colors.white,
  },
});

export default LoginScreen;
