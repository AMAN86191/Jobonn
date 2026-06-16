import React from 'react';
import {
  View, StyleSheet, StatusBar,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/Allroute';
import CandidateSignupFlow from './signup/CandidateSignupFlow';
import ManagerSignupFlow from './signup/ManagerSignupFlow';
import AppBackground from '../../components/layout/AppBackground';
import OTPVerificationModal from '../../components/modals/OTPVerificationModal';
import CreatePasswordModal from '../../components/modals/CreatePasswordModal';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import { SendOtpSlice, VerifyOtpSlice } from '../../redux/AuthSlice';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
  route: RouteProp<RootStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const role = route.params?.role ?? 'candidate';
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otpError, setOtpError] = useState('');


  const [mainLoading, setMainLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempFormData, setTempFormData] = useState<any>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Phase 1: User fills basic info → send OTP
  const handleComplete = async (finalData: any) => {
    try {
      setMainLoading(true);
      setTempFormData(finalData);
      setUserEmail(finalData.email || '');
      
      const payload = { ...finalData };
      delete payload.role;
      console.log('payload Send Otp', payload)
      const res = await dispatch(SendOtpSlice(payload) as any).unwrap();
      console.log('res', res)
      if (res?.status) {
        ToastAndroid.show(res?.message || 'OTP sent successfully.', ToastAndroid.SHORT);
        setShowOtpModal(true);
      } else {
        ToastAndroid.show(res?.message || 'Failed to send OTP.', ToastAndroid.LONG);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to send OTP';
      console.log('API Error:', error);
      ToastAndroid.show(errorMsg, ToastAndroid.LONG);
    } finally {
      setMainLoading(false);
    }
  };

  // Phase 2: Verify OTP → show password modal
  const handleVerifyOtp = async (otp: string) => {
    try {
      setOtpLoading(true);
      const resOtpVerify =  await VerifyOtpSlice({ otp });
      setShowOtpModal(false);
      setOtpError('');
      setShowPasswordModal(true);
    } catch (error: any) {
      console.error('OTP Verification failed:', error?.response?.data || error);
      const errorMsg = error?.response?.data?.message || 'Invalid OTP. Please try 1234';
      setOtpError(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Phase 3: Set password → Register → Navigate to CompleteProfile
  const handleSetPasswordAndRegister = async (password: string) => {
    try {
      setRegisterLoading(true);

      // Build simple registration payload
      const registerPayload: any = {
        name: tempFormData.name || tempFormData.full_name,
        email: tempFormData.email,
        phone: tempFormData.phone,
        role: tempFormData.role,
        password: password,
      };

      // Manager has extra fields
      if (role === 'manager' || tempFormData.role === 'company') {
        registerPayload.w_phone = tempFormData.w_phone;
        registerPayload.job_title = tempFormData.job_title;
      }

      // const res = await Register(registerPayload);
      // await AsyncStorage.setItem('userToken', res.access_token);
      // await AsyncStorage.setItem('userData', JSON.stringify(res.data));

      setShowPasswordModal(false);
      ToastAndroid.show('Account Created Successfully!', ToastAndroid.SHORT);

      // Navigate to CompleteProfile instead of Home
      navigation.replace('CompleteProfile', { role });
    } catch (error: any) {
      console.error('Registration failed:', error?.response?.data || error);
      ToastAndroid.show(error?.response?.data?.message || 'Registration failed', ToastAndroid.LONG);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <ScrollView
          style={styles.flexTransparent}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <ChevronLeft color={Colors.textPrimary} size={wp('6%')} />
              </TouchableOpacity>
            </View>

            {/* Content - Simplified flows */}
            <View style={[styles.flowContainer, mainLoading && { opacity: 0.5 }]} pointerEvents={mainLoading ? 'none' : 'auto'}>
              {role === 'candidate' ? (
                <CandidateSignupFlow onComplete={handleComplete} loading={mainLoading} />
              ) : (
                <ManagerSignupFlow onComplete={handleComplete} loading={mainLoading} />
              )}
            </View>
          </View>

          <OTPVerificationModal
            isVisible={showOtpModal}
            onClose={() => setShowOtpModal(false)}
            email={userEmail}
            onVerify={handleVerifyOtp}
            loading={otpLoading}
            externalError={otpError}
            context="signup"
          />

          <CreatePasswordModal
            isVisible={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onSubmit={handleSetPasswordAndRegister}
            loading={registerLoading}
          />
        </ScrollView>

      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexTransparent: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('4%'),
  },
  topHeader: {
    paddingTop: hp('6%'),
    paddingBottom: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flowContainer: {
    flex: 1,
  },
});

export default SignupScreen;
