import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, Edit3 } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { getCompanyProfileSlice } from '../../redux/CompanyHomeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogoutSlice } from '../../redux/AuthSlice';

import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import AwardsAndRecognitions from '../../components/Manager_component/AwardsAndRecognitions';
import ProfileCompletenessBanner from '../../components/Manager_component/ProfileCompletenessBanner';

// Modular Sub-Components
import CoverIdentityCard from '../../components/Manager_component/CoverIdentityCard';
import RecruitmentStatsRow from '../../components/Manager_component/RecruitmentStatsRow';
import PackageAccessCard from '../../components/Manager_component/PackageAccessCard';
import RecruiterDetailsCard from '../../components/Manager_component/RecruiterDetailsCard';
import AboutCompanyCard from '../../components/Manager_component/AboutCompanyCard';
import CompanyInfoCard from '../../components/Manager_component/CompanyInfoCard';
import OpenPositionsCarousel from '../../components/Manager_component/OpenPositionsCarousel';

import { getProfileCompleteness } from '../../utils/profileCompleteness';
import { normalizeProfileData } from '../../utils/profileNormalizer';

const ManagerProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Profile state data
  const [user, setUser] = useState<any>({
    name: '',
    email: '',
    phone: '',
    manager_profile: {},
    stats: {}
  });
  const [rawProfileData, setRawProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getCompanyProfileSlice() as any).unwrap();
      console.log('Company Profile response:', response);
      const rawData = response?.data || response?.company || response;
      setRawProfileData(rawData);
      const normalized = normalizeProfileData(rawData);
      setUser(normalized);
    } catch (error) {
      console.error('Error fetching manager profile:', error);
      ToastAndroid.show('Failed to load profile', ToastAndroid.SHORT);
      setUser(normalizeProfileData(null));
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    navigation.navigate('UpdateCompanyProfileScreen', {
      role: 'company',
      company_id: user.companyid,
      isEditMode: true,
      profileData: rawProfileData
    });
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await dispatch(LogoutSlice() as any).unwrap();
    } catch (error) {
      console.warn('Logout API failed:', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login', params: { role: 'company' } }],
      });
    }
  };

  const completeness = rawProfileData ? getProfileCompleteness(rawProfileData) : null;
  const isProfileIncomplete = completeness ? !completeness.isComplete : true;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <MainManagerHeader
        title="Profile"
        subtitle="Manage your company and recruitment details"
        rightComponent={
          <TouchableOpacity style={styles.editBtn} onPress={handleEditPress}>
            <Edit3 color={Colors.primary} size={RFValue(10.5)} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, hp('12%')) }]}
        >
          {/* Cover & Branding Card */}
          <CoverIdentityCard
            coverImage={user.manager_profile?.coverImage}
            companyLogo={user.manager_profile?.companyLogo}
            companyName={user.manager_profile?.companyName}
            userName={user.name}
            location={user.manager_profile?.location}
            industry={user.manager_profile?.industry}
            companySize={user.manager_profile?.companySize}
            website={user.manager_profile?.website}
          />

          {/* Complete Profile Banner / Dynamic Recruitment Stats Row */}
          {isProfileIncomplete ? (
            <ProfileCompletenessBanner user={rawProfileData} navigation={navigation} />
          ) : (
            <RecruitmentStatsRow
              postedJobs={user.stats?.postedJobs}
              totalApplicants={user.stats?.totalApplicants}
              shortlisted={user.stats?.shortlisted}
              hired={user.stats?.hired}
            />
          )}

          {/* Package and Expiry Details Card */}
          <PackageAccessCard
            packageName={user.manager_profile?.activePackageName}
            duration={user.manager_profile?.activePackageDuration}
            expiryDate={user.manager_profile?.activePackageExpiry}
          />

          {/* Recruiter Details Card */}
          <RecruiterDetailsCard
            name={user.name}
            jobTitle={user.manager_profile?.jobTitle}
            createdAt={user.created_at}
            email={user.email}
            phone={user.phone}
          />

          {/* About Company Card */}
          <AboutCompanyCard bio={user.manager_profile?.bio} />

          {/* Company Information & Socials Card */}
          <CompanyInfoCard
            industry={user.manager_profile?.industry}
            companySize={user.manager_profile?.companySize}
            gstNumber={user.manager_profile?.gstNumber}
            foundedIn={user.manager_profile?.foundedIn}
            headquarters={user.manager_profile?.headquarters}
            fbLink={user.manager_profile?.fb_link}
            instaLink={user.manager_profile?.insta_link}
            linkedLink={user.manager_profile?.linked_link}
          />

          {/* Awards & Recognitions Component */}
          {user.manager_profile?.awards && user.manager_profile.awards.length > 0 && (
            <AwardsAndRecognitions awards={user.manager_profile.awards} />
          )}

          {/* Open Positions horizontal carousel */}
          <OpenPositionsCarousel
            positions={user.manager_profile?.openPositions}
            onViewAllJobs={() => navigation.navigate('ManagerAllJobs')}
            onViewJobDetails={(jobId) => navigation.navigate('ManagerJobDetails', { jobId })}
          />

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <LogOut color={Colors.danger} size={RFValue(12)} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  editBtnText: {
    fontSize: RFValue(8.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: wp('3.5%'),
    paddingTop: hp('1.5%'),
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: hp('1.4%'),
    marginVertical: hp('1%'),
    borderWidth: 1,
    borderColor: Colors.danger + '25',
  },
  logoutText: {
    fontSize: RFValue(9.5),
    color: Colors.danger,
    fontWeight: '800',
  },
});

export default ManagerProfileScreen;
