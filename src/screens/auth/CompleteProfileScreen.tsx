import React, { useState } from 'react';
import {
  View, StyleSheet, StatusBar, Text,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';
import CandidateProfileSteps from './profile/CandidateProfileSteps';
import ManagerProfileSteps from "./profile/ManagerProfileSteps";
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ChevronLeft, CheckCircle, Sparkles } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import { CompleteRegistrationSlice } from '../../redux/AuthSlice';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CompleteProfile'>;
  route: RouteProp<RootStackParamList, 'CompleteProfile'>;
};

const CompleteProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const role = route.params?.role ?? 'candidate';
  const company_id = route.params?.company_id ?? '';
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const companyProfileDataRef = useRef<any>({});
  const totalSteps = role === 'candidate' ? 5 : 2;
 console.log('role', role)
  const handleStepSave = async (stepData: any, stepIndex: number) => {
    try {
      setSaving(true);
      if (role === 'company') {
        companyProfileDataRef.current = { ...companyProfileDataRef.current, ...stepData };
        console.log(`[CompleteProfile] Company Step ${stepIndex + 1} cached:`, stepData);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Progress saved!',
        });
        return;
      }
      // await UpdateProfile(stepData);
      console.log(`[CompleteProfile] Step ${stepIndex + 1} saved:`, stepData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Progress saved!',
      });
    } catch (error: any) {
      console.error('Profile update failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAllComplete = async () => {
    try {
      setSaving(true);
      if (role === 'company') {
        const data = companyProfileDataRef.current;
        console.log('Final accumulated Company Profile data:', data);
        const formData = new FormData();
        
        formData.append('company_id', String(company_id || ''));
        formData.append('company_name', data.companyName || '');
        formData.append('office_location', data.location || '');
        formData.append('industry_type', data.industry || '');
        formData.append('company_size', data.companySize || '');
        formData.append('company_web_url', data.website || '');
        formData.append('company_about', data.bio || '');
        formData.append('gst_no', data.gstNumber || '');
        formData.append('founded_date', data.foundedDate || '');
        formData.append('fb_link', data.fb_link || '');
        formData.append('insta_link', data.insta_link || '');
        formData.append('linked_link', data.linked_link || '');

        const awardsList = data.awards || [];
        awardsList.forEach((award: any, index: number) => {
          formData.append(`awards[${index}][award_title]`, award.title || '');
          formData.append(`awards[${index}][award_date]`, award.date || '');
          formData.append(`awards[${index}][desc]`, award.description || '');
        });

        if (data.companyLogo && data.companyLogo.uri) {
          formData.append('company_logo', {
            uri: data.companyLogo.uri,
            name: data.companyLogo.name || 'logo.png',
            type: data.companyLogo.type || 'image/png'
          } as any);
        }

        if (data.coverImage && data.coverImage.uri) {
          formData.append('cover_img', {
            uri: data.coverImage.uri,
            name: data.coverImage.name || 'cover.jpg',
            type: data.coverImage.type || 'image/jpeg'
          } as any);
        }

        if (data.verifDoc && data.verifDoc.uri) {
          formData.append('company_docs', {
            uri: data.verifDoc.uri,
            name: data.verifDoc.name || 'document.pdf',
            type: data.verifDoc.type || 'application/pdf'
          } as any);
        }

        console.log('Submitting Company Registration payload:', formData);
        
        const res = await dispatch(CompleteRegistrationSlice(formData) as any).unwrap();
        console.log('Complete registration response:', res);

        if (res?.token) {
          await AsyncStorage.setItem('userToken', res.token);
        }
        if (res?.company) {
          const userData = {
            ...(res.company.user || {}),
            company: res.company,
            profile_completed: true,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        }

        Toast.show({
          type: 'success',
          text1: 'Registration Completed',
          text2: res?.message || 'Company Profile updated successfully!',
        });
        
        setIsCompleted(true);
        return;
      }

      // await UpdateProfile({ profile_completed: true });
      setIsCompleted(true);
    } catch (error: any) {
      console.error('Failed to mark profile complete:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Complete Profile',
        text2: error?.message || 'An error occurred during submission.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSkipStep = (stepIndex: number) => {
    if (stepIndex < totalSteps - 1) {
      setCurrentStepIndex(stepIndex + 1);
    } else {
      handleAllComplete();
    }
  };

  const handleCompleteLater = () => {
    Alert.alert(
      'Complete Later?',
      'You can always complete your profile from Settings. An incomplete profile may limit your visibility.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Go to Home',
          onPress: () => {
            if (role === 'candidate') navigation.replace('CandidateHome');
            else navigation.replace('ManagerHome');
          },
        },
      ]
    );
  };

  const handleGoHome = () => {
    if (role === 'candidate') navigation.replace('CandidateHome');
    else navigation.replace('ManagerHome');
  };

  // Completion celebration screen
  if (isCompleted) {
    return (
      <AppBackground>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.celebrationContainer}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.celebrationContent}>
            <View style={styles.celebrationIconContainer}>
              <View style={styles.celebrationIconBg}>
                <CheckCircle color={Colors.success} size={wp('16%')} />
              </View>
              <View style={styles.sparkle1}>
                <Sparkles color={Colors.warning} size={wp('5%')} />
              </View>
              <View style={styles.sparkle2}>
                <Sparkles color={Colors.primary} size={wp('4%')} />
              </View>
            </View>

            <Text style={styles.celebrationTitle}>Profile Complete! 🎉</Text>
            <Text style={styles.celebrationSubtitle}>
              {role === 'candidate'
                ? 'Your profile is ready. Start exploring job opportunities now!'
                : 'Your company profile is set up. Start posting jobs and finding talent!'
              }
            </Text>

            <View style={styles.completionBadge}>
              <Text style={styles.completionBadgeText}>100% Complete</Text>
            </View>

            <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.celebrationActions}>
              <TouchableOpacity style={styles.goHomeBtn} onPress={handleGoHome} activeOpacity={0.8}>
                <Text style={styles.goHomeBtnText}>
                  {role === 'candidate' ? 'Explore Jobs →' : 'Go to Dashboard →'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </AppBackground>
    );
  }

  const progressPercent = Math.round(((currentStepIndex) / totalSteps) * 100);

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
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
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (currentStepIndex > 0) {
                    setCurrentStepIndex(prev => prev - 1);
                  }
                }}
                activeOpacity={0.7}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft
                  color={currentStepIndex === 0 ? Colors.textPrimary : Colors.textPrimary}
                  size={wp('5%')}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCompleteLater} activeOpacity={0.7}>
                <Text style={styles.completeLaterText}>Complete Later</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Section */}
            <Animated.View entering={FadeInDown.duration(300)} style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Complete Your Profile</Text>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>{progressPercent}%</Text>
                </View>
              </View>
              <Text style={styles.progressSubtitle}>
                Step {currentStepIndex + 1} of {totalSteps}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
              </View>
            </Animated.View>

            {/* Step Content */}
            <View style={styles.stepContainer}>
              {role === 'candidate' ? (
                <CandidateProfileSteps
                  currentStep={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                  onStepSave={handleStepSave}
                  onAllComplete={handleAllComplete}
                  onSkipStep={handleSkipStep}
                  saving={saving}
                  totalSteps={totalSteps}
                />
              ) : (
                <ManagerProfileSteps
                  currentStep={currentStepIndex}
                  onStepChange={setCurrentStepIndex}
                  onStepSave={handleStepSave}
                  onAllComplete={handleAllComplete}
                  onSkipStep={handleSkipStep}
                  saving={saving}
                  totalSteps={totalSteps}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexTransparent: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('4%'),
  },
  topHeader: {
    paddingTop: hp('6%'),
    paddingBottom: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  completeLaterText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: hp('2.5%'),
    backgroundColor: Colors.white,
    padding: wp('2%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.2%'),
  },
  progressTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  progressBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('3%'),
  },
  progressBadgeText: {
    fontSize: RFValue(10),
    color: Colors.primary,
    fontWeight: '800',
  },
  progressSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: hp('1.5%'),
  },
  progressBarContainer: {
    width: '100%',
    height: hp('0.8%'),
    backgroundColor: Colors.border,
    borderRadius: hp('0.4%'),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: hp('0.4%'),
  },
  stepContainer: {
    flex: 1,
  },

  // Celebration styles
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  celebrationContent: {
    alignItems: 'center',
  },
  celebrationIconContainer: {
    position: 'relative',
    marginBottom: hp('3%'),
  },
  celebrationIconBg: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('14%'),
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.success + '30',
  },
  sparkle1: {
    position: 'absolute',
    top: -wp('2%'),
    right: -wp('2%'),
  },
  sparkle2: {
    position: 'absolute',
    bottom: wp('1%'),
    left: -wp('3%'),
  },
  celebrationTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  celebrationSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('2.8%'),
    marginBottom: hp('3%'),
    paddingHorizontal: wp('4%'),
  },
  completionBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: Colors.success + '30',
    marginBottom: hp('4%'),
  },
  completionBadgeText: {
    fontSize: RFValue(13),
    color: Colors.success,
    fontWeight: '800',
  },
  celebrationActions: {
    width: '100%',
  },
  goHomeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('4%'),
    borderRadius: wp('3.5%'),
    alignItems: 'center',
  },
  goHomeBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
    fontSize: RFValue(12),
  },
});

export default CompleteProfileScreen;
