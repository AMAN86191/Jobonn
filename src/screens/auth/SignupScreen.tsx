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
import { useDispatch } from 'react-redux';
import {
  SendOtpSlice, VerifyOtpSlice, SetPasswordSlice,
  SendOtpCandidateSlice, VerifyOtpCandidateSlice, SetPasswordCandidateSlice
} from '../../redux/AuthSlice';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser, logSignUp } from '../../services/firebase/analytics';
import { setCrashlyticsUser } from '../../services/firebase/crashlytics';

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
  const [companyId, setCompanyId] = useState<string | number | null>(null);

  // Phase 1: User fills basic info → send OTP
  const handleComplete = async (finalData: any) => {
    try {
      setMainLoading(true);
      setTempFormData(finalData);
      setUserEmail(finalData.email || '');

      const payload = { ...finalData };
      delete payload.role;
      console.log('payload Send Otp', payload);

      const res = await (role === 'company'
        ? dispatch(SendOtpSlice(payload) as any)
        : dispatch(SendOtpCandidateSlice(payload) as any)
      ).unwrap();

      console.log('res', res);
      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res?.message || 'OTP sent successfully.',
        });
        setShowOtpModal(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res?.message || 'Failed to send OTP.',
        });
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to send OTP';
      console.log('API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
    } finally {
      setMainLoading(false);
    }
  };

  // Phase 2: Verify OTP → show password modal
  const handleVerifyOtp = async (otp: string, phone?: string) => {
    try {
      setOtpLoading(true);
      const payload = {
        "phone": phone || tempFormData?.phone,
        "otp": otp
      };

      const resOtpVerify = await (role === 'company'
        ? dispatch(VerifyOtpSlice(payload) as any)
        : dispatch(VerifyOtpCandidateSlice(payload) as any)
      ).unwrap();

      console.log('resOtpVerify', resOtpVerify);
      if (resOtpVerify?.status == false) {
        const errorMsg = resOtpVerify?.message || 'Invalid OTP';
        setOtpError(errorMsg);
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: errorMsg,
        });
        return;
      }

      // Store company_id or candidate_id from successful verification
      if (resOtpVerify?.company_id) {
        setCompanyId(resOtpVerify.company_id);
      } else if (resOtpVerify?.candidate_id) {
        setCompanyId(resOtpVerify.candidate_id);
      } else if (resOtpVerify?.id) {
        setCompanyId(resOtpVerify.id);
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: resOtpVerify?.message || 'OTP Verified Successfully',
      });

      setShowOtpModal(false);
      setOtpError('');
      setShowPasswordModal(true);
    } catch (error: any) {
      console.error('OTP Verification failed:', error?.response?.data || error);
      const errorMsg = error?.message || 'Invalid OTP. Please try 1234';
      setOtpError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMsg,
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // Phase 3: Set password → Register → Navigate to CompleteProfile
  const handleSetPasswordAndRegister = async (password: string) => {
    try {
      setRegisterLoading(true);

      const payload = role === 'company'
        ? {
          company_id: String(companyId || ""),
          password: password,
          password_confirmation: password,
        }
        : {
          candidate_id: String(companyId || ""),
          password: password,
          password_confirmation: password,
        };

      const resSetPassword = await (role === 'company'
        ? dispatch(SetPasswordSlice(payload) as any)
        : dispatch(SetPasswordCandidateSlice(payload) as any)
      ).unwrap();

      console.log('resSetPassword', resSetPassword);

      if (resSetPassword?.status === false) {
        Toast.show({
          type: 'error',
          text1: 'Failed to Set Password',
          text2: resSetPassword?.message || 'Failed to set password.',
        });
        return;
      }

      if (resSetPassword?.token) {
        await AsyncStorage.setItem('userToken', resSetPassword.token);
      }
      let userData: any = null;
      if (role === 'company') {
        const companyObj = resSetPassword.company || {};
        const userObj = companyObj.user || resSetPassword.user || {};
        userData = {
          ...userObj,
          company: companyObj,
          role: 'company',
          profile_completed: false,
        };
      } else if (role === 'candidate') {
        const candObj = resSetPassword.candidate || {};
        const userObj = candObj.user || resSetPassword.user || {};
        userData = {
          ...userObj,
          candidate: candObj,
          role: 'candidate',
          profile_completed: false,
        };
      } else if (resSetPassword?.user) {
        userData = {
          ...resSetPassword.user,
          profile_completed: false,
        };
      }

      if (userData) {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        const userId = String(userData.id || '');
        if (userId) {
          setUser(userId, {
            email: userData.email || '',
            role: role,
          });
          setCrashlyticsUser(userId, userData.email || '', userData.name || '');
        }
        logSignUp('email');
      }

      Toast.show({
        type: 'success', 
        text1: 'Password Set Successful',
        text2: resSetPassword?.message || 'Now fill the details to complete your profile.',
      });

      setShowPasswordModal(false);
      // Navigate to CompleteProfile instead of Home
      navigation.replace('CompleteProfile', {
        ...resSetPassword,
        role: role,
        company_id: role === 'company' ? (companyId || resSetPassword?.company_id) : undefined,
        candidate_id: role === 'candidate' ? (companyId || resSetPassword?.candidate_id) : undefined
      } as any);
    } catch (error: any) {
      console.error('Registration failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error?.message || 'Registration failed',
      });
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
            phone={tempFormData?.phone}
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
