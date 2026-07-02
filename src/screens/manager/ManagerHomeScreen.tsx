import React, { useState, useEffect, useMemo } from 'react';
import {
  View, StyleSheet, StatusBar, TouchableOpacity, Text, ScrollView, ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Briefcase, Calendar, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/Colors';
import ManagerHeader from '../../components/Manager_component/ManagerHeader';
import PostJobBanner from '../../components/Manager_component/PostJobBanner';
import ActiveJobCard from '../../components/Manager_component/ActiveJobCard';
import AdSlider from '../../components/Manager_component/AdSlider';
import { RFValue } from 'react-native-responsive-fontsize';
import ProfileCompletenessBanner from '../../components/Manager_component/ProfileCompletenessBanner';
import { getProfileCompleteness } from '../../utils/profileCompleteness';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyJobsSlice, getCompanyProfileSlice, getRecommendedCandidatesSlice } from '../../redux/CompanyHomeSlice';
import { normalizeBackendJob } from '../../utils/jobNormalizer';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import Toast from 'react-native-toast-message';
import StatCard from '../../components/Manager_component/StatCard';



const normalizeRecommendedCandidate = (cand: any) => {
  if (!cand) return null;
  const currentCTC = cand.current_ctc ? `${cand.current_ctc} LPA` : undefined;
  const expectedCTC = cand.expected_salary ? `${cand.expected_salary} LPA` : undefined;
  const profileImg = cand.profile_img || cand.docs?.profile_img || cand.image;
  return {
    id: String(cand.id),
    user_id: cand.user_id,
    candidate_id: cand.id,
    name: cand.name || '',
    role: cand.job_title || cand.role || '',
    experience: cand.experience || 'Fresher',
    location: cand.location || '',
    status: undefined,
    currentCTC: currentCTC,
    expectedCTC: expectedCTC,
    image: profileImg ? { uri: profileImg.startsWith('http') ? profileImg : `https://admin.jobonn.in/storage/${profileImg}` } : undefined,
    emailAddress: cand.email || '',
    phoneNumber: cand.phone || '',
    whatsappNumber: cand.phone || '',
    noticePeriod: cand.notice_period || 'Immediate',
    preferredLocation: cand.location || '',
    rawCandidate: cand,
  };
};

const getLatestActivePackage = (profile: any) => {
  if (!profile?.company_packages || !Array.isArray(profile.company_packages)) return null;
  const activePackages = profile.company_packages.filter((p: any) => p.status === 'active');
  if (activePackages.length === 0) return null;
  return [...activePackages].sort((a: any, b: any) => Number(b.id) - Number(a.id))[0];
};

const ManagerHomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [companyProfile, setCompanyProfile] = useState<any>(null);

  const [recommendedCandidates, setRecommendedCandidates] = useState<any[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  const fetchRecommended = async () => {
    try {
      setLoadingRecommended(true);
      const res = await dispatch(getRecommendedCandidatesSlice() as any).unwrap();
      console.log('Home getRecommendedCandidates response:', res);
      const rawList = res?.data || res?.candidates || (Array.isArray(res) ? res : []);
      const normalized = rawList.map((c: any) => normalizeRecommendedCandidate(c)).filter(Boolean);
      setRecommendedCandidates(normalized.slice(0, 5));
    } catch (e) {
      console.log('Error fetching recommended candidates on home:', e);
    } finally {
      setLoadingRecommended(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  const { jobs: rawJobs, loading, lastPage } = useSelector((state: any) => state.companyHome);
  const STATS = useMemo(() => {
    const activeJobsCount = rawJobs?.length || 0;
    const totalApplicants = companyProfile?.application_stats?.total || 0;
    const scheduledInterviews = companyProfile?.application_stats?.interview_schedule || companyProfile?.application_stats?.interview || 0;
    return [
      { id: '1', title: 'Active Jobs', value: `${activeJobsCount}`, icon: Briefcase, color: Colors.primary, subtitle: 'Active listings' },
      { id: '2', title: 'Applicants', value: `${totalApplicants}`, icon: Users, color: Colors.info, subtitle: 'Total applied' },
      { id: '3', title: 'Interviews', value: `${scheduledInterviews}`, icon: Calendar, color: Colors.success, subtitle: 'Scheduled' },
    ];
  }, [rawJobs, companyProfile]);
  useEffect(() => {
    dispatch(getCompanyJobsSlice(page) as any);
  }, [dispatch, page]);

  const normalizedJobs = useMemo(() => {
    return (rawJobs || []).map((job: any) => normalizeBackendJob(job));
  }, [rawJobs]);

  const activeCompanyPackage = useMemo(() => {
    return getLatestActivePackage(companyProfile);
  }, [companyProfile]);

  const isLimitExceeded = useMemo(() => {
    if (!companyProfile) return false;
    const activePackageObj = getLatestActivePackage(companyProfile);
    if (!activePackageObj) return true;

    const used = Number(activePackageObj.used_job_posts || 0);
    const total = Number(activePackageObj.package?.no_of_job_post || 0);
    return total > 0 && used >= total;
  }, [companyProfile]);

  const activePackageMessage = useMemo(() => {
    if (!companyProfile) return '';
    const activePackageObj = getLatestActivePackage(companyProfile);
    if (!activePackageObj) {
      return 'You do not have any active package. Please purchase a plan to unlock all features.';
    }
    const used = Number(activePackageObj.used_job_posts || 0);
    const total = Number(activePackageObj.package?.no_of_job_post || 0);
    if (total > 0 && used >= total) {
      return `You have used all posts in your active plan.`;
    }
    return '';
  }, [companyProfile]);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem('userData');
    console.log('data', JSON.parse(data as any));
    if (data) setUser(JSON.parse(data));

    try {
      const profile = await dispatch(getCompanyProfileSlice() as any).unwrap();
      console.log('Company Profile Response:', profile);
      if (profile && profile.company) {
        setCompanyProfile(profile.company);
      }
    } catch (error) {
      console.log('Error fetching company profile:', error);
    }
  };

  const handlePostJobPress = () => {
    if (!companyProfile) {
      Toast.show({
        type: 'error',
        text1: 'Loading Profile',
        text2: 'Loading profile details. Please try again in a moment.',
      });
      return;
    }

    // Check profile completeness (minimum 90% required to post job)
    const completeness = getProfileCompleteness(companyProfile);
    if (completeness.percentage < 90) {
      Toast.show({
        type: 'error',
        text1: 'Profile Incomplete',
        text2: `Complete your company profile to post a job (${completeness.percentage}% completed).`,
      });
      return;
    }

    const activePackageObj = getLatestActivePackage(companyProfile);

    if (!activePackageObj) {
      Toast.show({
        type: 'error',
        text1: 'Purchase Required',
        text2: 'Please purchase package',
      });
      return;
    }

    const used = Number(activePackageObj.used_job_posts || 0);
    const total = Number(activePackageObj.package?.no_of_job_post || 0);

    if (total > 0 && used >= total) {
      Toast.show({
        type: 'error',
        text1: 'Limit Exceeded',
        text2: `Job post limit exceeded. Used: ${used}/${total}`,
      });
      return;
    }

    navigation.navigate('PostJob');
  };

  useEffect(() => {
    loadUser();

    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
      dispatch(getCompanyJobsSlice(1) as any);
      setPage(1);
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ManagerHeader onNotifPress={() => navigation.navigate('ManagerNotifications')} />

        <PostJobBanner onPress={handlePostJobPress} />

        {/* <View style={styles.companySwitcherCard}>
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
        </View> */}
        {/* 
        <View style={styles.controlGrid}>
          <TouchableOpacity style={styles.controlCard} onPress={() => navigation.navigate('PackageManagement')}>
            <CreditCard size={RFValue(13)} color={Colors.primary} />
            <Text style={styles.controlValue}>{activeCompanyPackage?.package?.package_name || 'No Package'}</Text>
            <Text style={styles.controlLabel}>
              {activeCompanyPackage
                ? `${activeCompanyPackage.used_job_posts || 0} / ${activeCompanyPackage.package?.no_of_job_post || 0} job posts`
                : 'Purchase to unlock posting'}
            </Text>
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
        </View>  */}

        {/* Profile Completeness Banner */}
        <ProfileCompletenessBanner user={user} navigation={navigation} />

        {/* Package Limit / Exceed Banner */}
        {isLimitExceeded && (
          <View style={styles.limitBanner}>
            <View style={styles.limitBannerContent}>
              <View style={styles.limitIconBg}>
                <AlertCircle color="#E11D48" size={RFValue(16)} />
              </View>
              <View style={styles.limitTextWrap}>
                <Text style={styles.limitTitle}>
                  {!activeCompanyPackage ? 'No Active Package' : 'Package Limit Exceeded'}
                </Text>
                <Text style={styles.limitSubtitle}>
                  {activePackageMessage}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.purchaseBtn}
              onPress={() => navigation.navigate('PackageManagement')}
              activeOpacity={0.8}
            >
              <Text style={styles.purchaseBtnText}>Purchase Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(item => (
            <StatCard
              key={item.id}
              {...item}
              onPress={() => {
                if (item.id === '1') navigation.navigate('ManagerJobsTab');
                else if (item.id === '2') navigation.navigate('ManagerApplicantsTab');
                else if (item.id === '3') navigation.navigate('ManagerInterviewsTab');
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

        {loading && normalizedJobs.length === 0 ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('2%') }} />
        ) : normalizedJobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active jobs found</Text>
            <TouchableOpacity style={styles.postFirstJobBtn} onPress={handlePostJobPress} activeOpacity={0.85}>
              <Text style={styles.postFirstJobBtnText}>Post Your First Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {normalizedJobs.map((job: any) => (
              <ActiveJobCard
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                vacancies={job.openings}
                applicants={job.applicants}
                status={job.status}
                onPress={() => navigation.navigate('ManagerJobDetails', { job })}
              />
            ))}

            {/* Pagination Controls */}
            {lastPage > 1 && (
              <View style={styles.paginationRow}>
                <TouchableOpacity
                  style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                  disabled={page === 1}
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ArrowLeft size={RFValue(11)} color={page === 1 ? Colors.textTertiary : Colors.primary} />
                  <Text style={[styles.pageBtnText, page === 1 && styles.pageBtnTextDisabled]}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfoText}>
                  Page {page} of {lastPage}
                </Text>

                <TouchableOpacity
                  style={[styles.pageBtn, page === lastPage && styles.pageBtnDisabled]}
                  disabled={page === lastPage}
                  onPress={() => setPage(p => Math.min(lastPage, p + 1))}
                >
                  <Text style={[styles.pageBtnText, page === lastPage && styles.pageBtnTextDisabled]}>Next</Text>
                  <ArrowRight size={RFValue(11)} color={page === lastPage ? Colors.textTertiary : Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

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
        {loadingRecommended ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('2%') }} />
        ) : recommendedCandidates.length > 0 ? (
          recommendedCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              {...candidate}
              avatarColor={getAvatarColor(candidate.name)}
              onPress={() => navigation.navigate('CandidateApplicationFullView', { applicant: candidate, isRecommended: true })}
            />
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: Colors.textTertiary, marginVertical: hp('2%'), fontSize: RFValue(10) }}>No recommended candidates found</Text>
        )}
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
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pageBtnDisabled: {
    borderColor: Colors.border,
  },
  pageBtnText: {
    fontSize: RFValue(9),
    color: Colors.primary,
    fontWeight: '700',
  },
  pageBtnTextDisabled: {
    color: Colors.textTertiary,
  },
  pageInfoText: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('3%'),
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: hp('1%'),
  },
  emptyText: {
    fontSize: RFValue(9.5),
    color: Colors.textSecondary,
    marginBottom: hp('1.2%'),
    fontWeight: '500',
  },
  postFirstJobBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1%'),
    borderRadius: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  postFirstJobBtnText: {
    color: Colors.white,
    fontSize: RFValue(9.5),
    fontWeight: '700',
  },
  limitBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    marginTop: hp('1%'),
  },
  limitBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
    gap: wp('3%'),
  },
  limitIconBg: {
    backgroundColor: '#FFE4E6',
    padding: wp('2%'),
    borderRadius: 10,
  },
  limitTextWrap: {
    flex: 1,
  },
  limitTitle: {
    fontSize: RFValue(11),
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: hp('0.2%'),
  },
  limitSubtitle: {
    fontSize: RFValue(8.8),
    color: '#B91C1C',
    fontWeight: '500',
    lineHeight: hp('1.8%'),
  },
  purchaseBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: hp('1%'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  purchaseBtnText: {
    color: Colors.white,
    fontSize: RFValue(10),
    fontWeight: '700',
  },
});

export default ManagerHomeScreen;
