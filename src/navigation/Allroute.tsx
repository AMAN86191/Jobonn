import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '../utils/NavigationService';
import { Colors } from '../theme/Colors';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';


// Candidate Screens
import CandidateDrawerNavigator from './CandidateDrawerNavigator';
import JobDetailsScreen from '../screens/candidate/JobDetailsScreen';
import ApplyJobFlow from '../screens/candidate/ApplyJobFlow';
import ApplicationSuccessScreen from '../screens/candidate/ApplicationSuccessScreen';
import CandidateNotificationsScreen from '../screens/candidate/CandidateNotificationsScreen';
import CandidateSearchScreen from '../screens/candidate/CandidateSearchScreen';
import AppliedJobsScreen from '../screens/candidate/AppliedJobsScreen';

// Manager Navigator & Screens
import ManagerDrawerNavigator from './ManagerDrawerNavigator';
import PostJobScreen from '../screens/manager/PostJobScreen';
import ManagerNotificationsScreen from '../screens/manager/ManagerNotificationsScreen';
import ManagerJobDetailsScreen from '../screens/manager/ManagerJobDetailsScreen';
import CandidateApplicationFullView from '../screens/manager/CandidateApplicationFullView';
import ManagerAllJobsScreen from '../screens/manager/ManagerAllJobsScreen';
import ManagerInterviewsScreen from '../screens/manager/ManagerInterviewsScreen';
import RecommendedCandidatesScreen from '../screens/manager/RecommendedCandidatesScreen';

import ManagerAnalyticsScreen from '../screens/manager/ManagerAnalyticsScreen';
import PackageManagementScreen from '../screens/manager/PackageManagementScreen';
import AuditLogScreen from '../screens/manager/AuditLogScreen';
import UpdateCompanyProfileScreen from '../screens/auth/UpdateCompanyProfileScreen';
import TermsAndConditionsScreen from '../screens/common/TermsAndConditionsScreen';

// ─── Route Param List ───────────────────────────────────────────────────────
export type RootStackParamList = {
  // Auth
  SplashScreen: undefined;
  Onboarding: undefined;
  RoleSelection: { fromSignup?: boolean };
  Login: { role?: 'candidate' | 'company' } | undefined;
  Signup: { role: 'candidate' | 'company' };
  CompleteProfile: { role?: 'candidate' | 'company';[key: string]: any } | undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;


  // Candidate
  CandidateHome: undefined;
  JobDetails: { job: any };
  ApplyJobFlow: { job: any };
  ApplicationSuccess: undefined;
  CandidateNotifications: undefined;
  CandidateSearch: undefined;
  AppliedJobs: undefined;

  // Manager
  ManagerHome: undefined;
  PostJob: { job?: any } | undefined;
  ManagerNotifications: undefined;
  ManagerJobDetails: { job: any };
  CandidateApplicationFullView: { applicant: any };
  ManagerAllJobs: undefined;
  ManagerInterviews: undefined;
  RecommendedCandidates: undefined;
  UpdateCompanyProfileScreen: { role?: 'candidate' | 'company'; company_id?: string | number; isEditMode?: boolean; profileData?: any;[key: string]: any } | undefined;
  ManagerAnalytics: undefined;
  PackageManagement: undefined;
  AuditLogs: undefined;
  TermsAndConditions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Main Navigator ──────────────────────────────────────────────────────────
const Allroute = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 350,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: Colors.white, elevation: 0 },
        }}

      >
        {/* ── Auth Flow ── */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: 'fade_from_bottom', animationDuration: 400 }}
        />
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{ animation: 'fade_from_bottom', animationDuration: 400 }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ animation: 'fade_from_bottom', animationDuration: 400 }}
        />


        {/* ── Candidate Flow ── */}
        <Stack.Screen
          name="CandidateHome"
          component={CandidateDrawerNavigator}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}

        />
        <Stack.Screen
          name="ApplyJobFlow"
          component={ApplyJobFlow}

        />
        <Stack.Screen
          name="ApplicationSuccess"
          component={ApplicationSuccessScreen}

        />
        <Stack.Screen
          name="CandidateNotifications"
          component={CandidateNotificationsScreen}
        />
        <Stack.Screen
          name="CandidateSearch"
          component={CandidateSearchScreen}
        />
        <Stack.Screen
          name="AppliedJobs"
          component={AppliedJobsScreen}
        />

        {/* ── Manager Flow ── */}
        <Stack.Screen
          name="ManagerHome"
          component={ManagerDrawerNavigator}
        />
        <Stack.Screen
          name="PostJob"
          component={PostJobScreen}
        />
        <Stack.Screen
          name="ManagerNotifications"
          component={ManagerNotificationsScreen}
        />
        <Stack.Screen
          name="ManagerJobDetails"
          component={ManagerJobDetailsScreen}
        />
        <Stack.Screen
          name="CandidateApplicationFullView"
          component={CandidateApplicationFullView}
        />
        <Stack.Screen
          name="ManagerAllJobs"
          component={ManagerAllJobsScreen}
        />
        <Stack.Screen
          name="ManagerInterviews"
          component={ManagerInterviewsScreen}
        />
        <Stack.Screen
          name="RecommendedCandidates"
          component={RecommendedCandidatesScreen}
        />
        <Stack.Screen
          name="UpdateCompanyProfileScreen"
          component={UpdateCompanyProfileScreen}
        />
        <Stack.Screen
          name="ManagerAnalytics"
          component={ManagerAnalyticsScreen}
        />
        <Stack.Screen
          name="PackageManagement"
          component={PackageManagementScreen}
        />
        <Stack.Screen
          name="AuditLogs"
          component={AuditLogScreen}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditionsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Allroute;
