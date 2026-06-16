import React from 'react';
import {
  View, StyleSheet, StatusBar, TouchableOpacity, Text, ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Briefcase, Calendar, AlertCircle, ChevronRight, Building2, CreditCard, FileClock, BarChart3 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../../theme/Colors';
import ManagerHeader from '../../components/Manager_component/ManagerHeader';
import PostJobBanner from '../../components/Manager_component/PostJobBanner';
import StatCard from '../../components/Manager_component/StatCard';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import ActiveJobCard from '../../components/Manager_component/ActiveJobCard';
import AdSlider from '../../components/Manager_component/AdSlider';
import { RFValue } from 'react-native-responsive-fontsize';
import { recruiterProfile, jobs, talentDatabase, managedCompanies, packages, contactCredits } from '../../data/jobonnStaticData';

const STATS = [
  { id: '1', title: 'Active Jobs', value: `${recruiterProfile.stats.postedJobs}`, icon: Briefcase, color: Colors.primary, subtitle: '+2 this week' },
  { id: '2', title: 'Applicants', value: `${recruiterProfile.stats.totalApplicants}`, icon: Users, color: Colors.info, subtitle: '+34 today' },
  { id: '3', title: 'Interviews', value: '18', icon: Calendar, color: Colors.success, subtitle: 'Scheduled' },
];

// const RECENT_APPLICANTS = [
//   { id: '1', name: 'Arjun Sharma', role: 'React Native Developer', experience: '4 yrs', location: 'Bangalore', skills: ['React Native', 'Redux', 'TypeScript'], status: 'New' as const, matchScore: 92, currentCTC: '18 LPA', expectedCTC: '22 LPA', time: '10m ago', image: require('../../../assets/images/boy.png') },
//   { id: '2', name: 'Priya Patel', role: 'UI/UX Designer', experience: '3 yrs', location: 'Mumbai', skills: ['Figma', 'Framer', 'React'], status: 'Shortlisted' as const, matchScore: 87, currentCTC: '12 LPA', expectedCTC: '15 LPA', time: '1h ago', image: require('../../../assets/images/boy.png') },
//   { id: '3', name: 'Rohit Kumar', role: 'Backend Developer', experience: '5 yrs', location: 'Hyderabad', skills: ['Node.js', 'AWS', 'MongoDB'], status: 'Interview' as const, currentCTC: '25 LPA', expectedCTC: '30 LPA', time: '3h ago', image: require('../../../assets/images/boy.png') },
// ];

const RECOMMENDED_CANDIDATES = talentDatabase
  .filter(candidate => candidate.matchScore >= 85)
  .slice(0, 2)
  .map(candidate => ({ ...candidate, time: `${candidate.matchScore}% Match` }));

const ACTIVE_JOBS = jobs.filter(job => job.status === 'Active').slice(0, 2);
const activePackage = packages.find(item => item.active);

const ManagerHomeScreen = ({ navigation }: any) => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ManagerHeader onNotifPress={() => navigation.navigate('ManagerNotifications')} />

        <PostJobBanner onPress={() => navigation.navigate('PostJob')} />

        <View style={styles.companySwitcherCard}>
          <View style={styles.companySwitcherHeader}>
            <View style={styles.companySwitcherTitleRow}>
              <Building2 size={RFValue(12)} color={Colors.primary} />
              <Text style={styles.companySwitcherTitle}>Company Switcher</Text>
            </View>
            <Text style={styles.companySwitcherSub}>Consultancy and agent ready</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companyChips}>
            {managedCompanies.map(company => (
              <TouchableOpacity key={company.id} style={[styles.companyChip, company.active && styles.companyChipActive]}>
                <Text style={[styles.companyChipTitle, company.active && styles.companyChipTitleActive]}>{company.name}</Text>
                <Text style={[styles.companyChipMeta, company.active && styles.companyChipMetaActive]}>{company.openJobs} jobs | {company.credits} credits</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.controlGrid}>
          <TouchableOpacity style={styles.controlCard} onPress={() => navigation.navigate('PackageManagement')}>
            <CreditCard size={RFValue(13)} color={Colors.primary} />
            <Text style={styles.controlValue}>{activePackage?.name || 'No Package'}</Text>
            <Text style={styles.controlLabel}>{contactCredits.remaining} unlock credits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlCard} onPress={() => navigation.navigate('AuditLogs')}>
            <FileClock size={RFValue(13)} color={Colors.warning} />
            <Text style={styles.controlValue}>Audit Logs</Text>
            <Text style={styles.controlLabel}>Actions tracked</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlCard} onPress={() => navigation.navigate('ManagerAnalytics')}>
            <BarChart3 size={RFValue(13)} color={Colors.info} />
            <Text style={styles.controlValue}>Reports</Text>
            <Text style={styles.controlLabel}>Hiring and revenue</Text>
          </TouchableOpacity>
        </View>

        {/* Incomplete Profile Banner */}
        {user && !user.profile_completed && (
          <TouchableOpacity
            style={styles.profileBanner}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CompleteProfile', { role: 'manager' })}
          >
            <View style={styles.profileBannerContent}>
              <View style={styles.profileBannerIconBg}>
                <AlertCircle size={RFValue(12)} color={Colors.warning} />
              </View>
              <View style={styles.profileBannerTextWrap}>
                <Text style={styles.profileBannerTitle}>Complete Company Profile</Text>
                <Text style={styles.profileBannerSub}>A verified company profile attracts more candidates.</Text>
              </View>
              <ChevronRight size={RFValue(12)} color={Colors.warning} />
            </View>
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(item => (
            <StatCard
              key={item.id}
              {...item}
              onPress={() => {
                if (item.id === '1') navigation.navigate('ManagerAllJobs');
                else if (item.id === '2') navigation.navigate('ManagerApplicantsTab');
                else if (item.id === '3') navigation.navigate('ManagerInterviews');
              }}
            />
          ))}
        </View>

        {/* Active Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Jobs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ManagerJobsTab')}>
            <Text style={styles.seeAll}>Manage →</Text>
          </TouchableOpacity>
        </View>
        {ACTIVE_JOBS.map(job => (
          <ActiveJobCard
            key={job.id}
            {...job}
            onPress={() => navigation.navigate('ManagerJobDetails', { job })}
          />
        ))}

        {/* Ad Slider */}
        <AdSlider />

        {/* Recent Applicants */}
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applicants</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ManagerApplicantsTab')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        {RECENT_APPLICANTS.map(applicant => (
          <CandidateCard
            key={applicant.id}
            {...applicant}
            avatarColor={getAvatarColor(applicant.name)}
            onPress={() => navigation.navigate('CandidateApplicationFullView', { applicant })}
          />
        ))} */}

        {/* Recommended Candidates */}
        <View style={[styles.sectionHeader, { marginTop: hp('2%') }]}>
          <Text style={styles.sectionTitle}>Recommended Candidates</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecommendedCandidates')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        {RECOMMENDED_CANDIDATES.map(candidate => (
          <CandidateCard
            key={candidate.id}
            {...candidate}
            avatarColor={getAvatarColor(candidate.name)}
            onPress={() => navigation.navigate('CandidateApplicationFullView', { applicant: candidate, isRecommended: true })}
          />
        ))}
        {/* Promo Banner */}
        <View style={styles.promoBanner} >
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>70% hiring{'\n'}happens without{'\n'}any job post</Text>
            <Text style={styles.promoSub}>Top companies on Naukri are hiring by directly reaching out to jobseekers without posting a job. Learn how you can make the best of this opportunity</Text>
            <Text style={styles.promoLink}>Learn more</Text>
          </View>
          <View style={styles.promoGraphic}>
            <View style={styles.promoCircle1} />
            <View style={styles.promoCircle2} />
            <Text style={styles.promoMiniText}>JobOn</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: wp('2%'), paddingTop: hp('0.5%') },
  sectionTitle: { fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.8%'),
    marginBottom: hp('1%'),
  },
  seeAll: { fontSize: RFValue(8.5), color: Colors.primary, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginBottom: hp('0.5%') },
  companySwitcherCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  companySwitcherHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  companySwitcherTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  companySwitcherTitle: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  companySwitcherSub: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  companyChips: {
    gap: wp('2%'),
  },
  companyChip: {
    minWidth: wp('38%'),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('2.5%'),
    padding: wp('2.5%'),
    backgroundColor: Colors.background,
  },
  companyChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  companyChipTitle: {
    fontSize: RFValue(8.8),
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: hp('0.3%'),
  },
  companyChipTitleActive: {
    color: Colors.primary,
  },
  companyChipMeta: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  companyChipMetaActive: {
    color: Colors.primary,
  },
  controlGrid: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginBottom: hp('1%'),
  },
  controlCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('2.5%'),
    minHeight: hp('8%'),
  },
  controlValue: {
    fontSize: RFValue(8.5),
    color: Colors.textPrimary,
    fontWeight: '800',
    marginTop: hp('0.7%'),
  },
  controlLabel: {
    fontSize: RFValue(7.2),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.2%'),
  },

  // Profile Banner
  profileBanner: {
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
    overflow: 'hidden',
  },
  profileBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
  },
  profileBannerIconBg: {
    backgroundColor: Colors.white,
    padding: wp('1.5%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  profileBannerTextWrap: {
    flex: 1,
  },
  profileBannerTitle: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.warning,
    marginBottom: hp('0.3%'),
  },
  profileBannerSub: {
    fontSize: RFValue(8.5),
    color: Colors.warning,
    fontWeight: '500',
  },

  promoBanner: {
    marginBottom: hp('8%'),
    backgroundColor: Colors.background,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  promoContent: {
    flex: 1,
    paddingRight: wp('15%'),
    zIndex: 2,
  },
  promoTitle: {
    fontSize: RFValue(16),
    fontWeight: '800',
    color: '#a3a9be',
    marginBottom: hp('1%'),
    lineHeight: hp('3%'),
  },
  promoSub: {
    fontSize: RFValue(9.5),
    color: '#8b92aa',
    lineHeight: hp('1.8%'),
    marginBottom: hp('1.5%'),
  },
  promoLink: {
    fontSize: RFValue(11),
    fontWeight: '700',
    color: Colors.primary,
  },
  promoGraphic: {
    position: 'absolute',
    right: wp('-5%'),
    bottom: hp('-5%'),
    width: wp('25%'),
    height: wp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  promoCircle1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: wp('20%'),
    borderWidth: wp('1%'),
    borderColor: Colors.primary,
  },
  promoCircle2: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: wp('20%'),
    borderWidth: wp('1%'),
    borderColor: '#FFD700',
  },
  promoMiniText: {
    fontSize: RFValue(12),
    fontWeight: '800',
    color: Colors.primary,
  },
});

export default ManagerHomeScreen;
