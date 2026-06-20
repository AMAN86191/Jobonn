import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar, TextInput, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Briefcase, Wifi, ShoppingBag, Clock, GraduationCap, Bell, Monitor, TrendingUp, PenTool, Users, ChevronRight, Menu, AlertCircle, ShieldCheck, FileText } from 'lucide-react-native';
import JobCard from '../../components/Candidate_component/JobCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { candidateProfile, jobs, jobInvites, getApplicationJobs } from '../../data/jobonnStaticData';
import CandidateProfileCompletenessBanner from '../../components/Manager_component/CandidateProfileCompletenessBanner';
import { getCandidateProfileCompleteness } from '../../utils/candidateProfileCompleteness';

import { useDispatch } from 'react-redux';
import { getProfileSlice } from '../../redux/CandidateProfileSlice';

const FEATURED_JOBS = jobs.filter(job => job.isFeatured);

const RECOMMENDED_JOBS = jobs.filter(job => job.isRecommended);

const CATEGORIES = [
  { id: 1, name: 'All Jobs', icon: Briefcase, color: Colors.primary },
  { id: 2, name: 'Remote', icon: Wifi, color: Colors.info },
  { id: 3, name: 'Full Time', icon: ShoppingBag, color: Colors.success },
  { id: 4, name: 'Part Time', icon: Clock, color: Colors.warning },
  { id: 5, name: 'Internship', icon: GraduationCap, color: Colors.info },
];

const TOP_COMPANIES = [
  { id: 1, name: 'Google', logo: require('../../../assets/images/google.png') },
  { id: 2, name: 'Microsoft', logo: require('../../../assets/images/microsoft.png') },
  { id: 3, name: 'Amazon', logo: require('../../../assets/images/social.png') },
  { id: 4, name: 'Apple', logo: require('../../../assets/images/apple.png') },
];

const DEPARTMENTS = [
  { id: 1, name: 'IT & Software', icon: Monitor, count: '10k+ Jobs', color: Colors.primary },
  { id: 2, name: 'Marketing', icon: TrendingUp, count: '5k+ Jobs', color: Colors.info },
  { id: 3, name: 'Design', icon: PenTool, count: '3k+ Jobs', color: Colors.warning },
  { id: 4, name: 'Sales', icon: Users, count: '8k+ Jobs', color: Colors.success },
];

const CandidateHomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(1);
  const [user, setUser] = useState<any>(null);

   const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUser(JSON.parse(data));
    } catch (err) {
      console.warn('Failed to load local cached user data', err);
    }

    try {
      const response = await dispatch(getProfileSlice() as any).unwrap();
      console.log('HomeScreen fetched fresh profile successfully:', response);
      if (response && response.status && response.candidate) {
        const candidate = response.candidate;
        const userObj = candidate.user || {};
        const mappedUser = {
          ...userObj,
          candidate: candidate,
          role: userObj.role || 'candidate',
        };
        await AsyncStorage.setItem('userData', JSON.stringify(mappedUser));
        setUser(mappedUser);
      }
    } catch (apiError) {
      console.error('Error fetching profile in HomeScreen:', apiError);
    }
  };

  React.useEffect(() => {
    loadUser();

    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
    });
    return unsubscribe;
  }, [navigation]);

  const profile = user || candidateProfile;
  const name = profile?.name || profile?.user?.name || 'User';
  const firstName = name.split(' ')[0];
  const appliedJobs = getApplicationJobs();
  const recentInvites = jobInvites.filter(invite => invite.status === 'pending');

  const completeness = getCandidateProfileCompleteness(user || candidateProfile);
  const completionPercent = completeness.percentage;

  const dashboardStats = [
    { label: 'Profile', value: `${completionPercent}%`, icon: TrendingUp, color: Colors.primary },
    { label: 'Applied', value: `${appliedJobs.length}`, icon: FileText, color: Colors.info },
    { label: 'Views', value: `${candidateProfile.profileViews}`, icon: Users, color: Colors.success },
    { label: 'Invites', value: `${recentInvites.length}`, icon: Bell, color: Colors.warning },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Navigation Row */}
        <View style={styles.topHeaderRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.8} style={styles.menuBtn}>
            <Menu size={RFValue(15)} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('CandidateNotifications')}>
            <Bell size={RFValue(15)} color={Colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* User Welcome Section */}
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeLeft}>

            <View>
              <Image source={require('../../../assets/images/logo/jpn on logo.png')} style={styles.avatarImage} />
            </View>

            <View style={styles.greetingContent}>
              <Text style={styles.greetingText}>Good morning</Text>
              <Text style={styles.userName}>Hi, {firstName}</Text>
              <Text style={styles.subText}>Find the perfect job{'\n'}that matches your skills.</Text>
            </View>
          </View>
          <Image source={require('../../../assets/images/bag.png')} style={styles.illustration} />
        </View>

        <View style={styles.statsGrid}>
          {dashboardStats.map(item => {
            const Icon = item.icon;
            return (
              <View key={item.label} style={styles.statTile}>
                <View style={[styles.statIconWrap, { backgroundColor: item.color + '15' }]}>
                  <Icon size={RFValue(11)} color={item.color} />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Incomplete Profile Banner */}
        <CandidateProfileCompletenessBanner user={user} navigation={navigation} />

        {/* Search Section */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchInputWrap}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CandidateSearch')}
          >
            <Search color={Colors.primary} size={RFValue(14)} />
            <TextInput
              placeholder="Search job title or company..."
              placeholderTextColor={Colors.textTertiary}
              style={styles.searchInput}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, isActive && styles.catCardActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <View style={styles.catIconWrap}>
                  <Icon size={RFValue(14)} color={isActive ? Colors.primary : cat.color} />
                </View>
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Featured Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Jobs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JobsTab')}>
            <Text style={styles.seeAllText}>See all {'>'}</Text>
          </TouchableOpacity>
        </View>

        {FEATURED_JOBS.map(job => (
          <JobCard
            key={job.id}
            {...job}
            onPress={() => navigation.navigate('JobDetails', { job })}
          />
        ))}

        {/* Recommended Jobs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('JobsTab')}>
            <Text style={styles.seeAllText}>See all {'>'}</Text>
          </TouchableOpacity>
        </View>

        {RECOMMENDED_JOBS.map(job => (
          <JobCard
            key={`rec-${job.id}`}
            {...job}
            onPress={() => navigation.navigate('JobDetails', { job })}
          />
        ))}

        {/* Top Companies Hiring */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Companies Hiring</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCompaniesRow}>
          {TOP_COMPANIES.map(comp => (
            <TouchableOpacity key={comp.id} style={styles.companyCard}>
              <View style={styles.companyLogoWrap}>
                <Image source={comp.logo} style={styles.companyLogo} />
              </View>
              <Text style={styles.companyName} numberOfLines={1}>{comp.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Explore by Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore by Category</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.departmentsRow}>
          {DEPARTMENTS.map(dep => {
            const Icon = dep.icon;
            return (
              <TouchableOpacity key={dep.id} style={styles.depCard}>
                <View style={[styles.depIconWrap, { backgroundColor: dep.color + '15' }]}>
                  <Icon size={RFValue(14)} color={dep.color} />
                </View>
                <View style={styles.depTextWrap}>
                  <Text style={styles.depName}>{dep.name}</Text>
                  <Text style={styles.depCount}>{dep.count}</Text>
                </View>
                <ChevronRight size={RFValue(12)} color={Colors.textTertiary} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Promo Banner */}
        <View style={styles.promoBanner} >
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Your profile is{'\n'}part of the{'\n'}talent database</Text>
            <Text style={styles.promoSub}>Recruiters can discover verified candidates, send invites, and move applications through a transparent hiring timeline.</Text>
            <Text style={styles.promoLink}>Keep profile updated</Text>
          </View>
          <View style={styles.promoGraphic}>
            <View style={styles.promoCircle1} />
            <View style={styles.promoCircle2} />
            <Text style={styles.promoMiniText}>JobOn</Text>
          </View>
        </View>

        <View style={{ height: hp('9%') }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    paddingHorizontal: wp('2%'),
  },
  illustration: {
    position: 'absolute',
    right: wp('1%'),
    width: wp('38%'),
    height: hp('10%'),
    resizeMode: 'contain',

  },
  // Header
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuBtn: {
    padding: wp('1%'),
  },
  notifBtn: {
    position: 'relative',
    padding: wp('1%'),
  },
  notifDot: {
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.danger,
    position: 'absolute',
    top: wp('1%'),
    right: wp('1%'),
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2%')
    // position: 'relative',
  },
  welcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3.5%'),
    flex: 1,
    // paddingRight: wp('38%'), 
  },

  avatarImage: {
    width: wp('12%'),
    height: wp('12%'),
    resizeMode: 'cover',
    borderRadius: wp('10%'),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarText: {
    color: Colors.white,
    fontSize: RFValue(20),
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginBottom: hp('1.2%'),
  },
  statTile: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
  },
  statIconWrap: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('0.4%'),
  },
  statValue: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  greetingContent: {
    flex: 1,
  },
  greetingText: {
    fontSize: RFValue(10.5),
    color: Colors.textSecondary,
    marginBottom: hp('0.3%'),
    fontWeight: '400',
  },
  userName: {
    fontSize: RFValue(16),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.8%'),
  },
  subText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    lineHeight: hp('2%'),
  },

  // Profile Banner
  profileBanner: {
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    borderRadius: wp('3%'),
    // marginBottom: hp('0.5%'),
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

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),
    marginBottom: hp('2%'),
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: wp('4%'),
    paddingHorizontal: wp('3%'),
    height: hp('4.5%'),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('2.5%'),
    fontSize: RFValue(11),
    color: Colors.textPrimary,
  },
  filterBtn: {
    width: hp('5.5%'),
    height: hp('5.5%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },

  // Categories
  categoriesRow: {
    // paddingBottom: hp('1%'),
    gap: wp('2%'),
  },
  catCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    alignItems: 'center',
    width: wp('20%'),
  },
  catCardActive: {
    borderColor: Colors.primary + '50',
    backgroundColor: Colors.primaryLight + '50',
  },
  catIconWrap: {
    marginBottom: hp('1%')
  },
  catText: {
    fontSize: RFValue(9),
    fontWeight: '600',
    color: Colors.textSecondary
  },
  catTextActive: {
    color: Colors.primary,
    fontWeight: '700'
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    marginTop: hp('1%')
  },
  sectionTitle: {
    fontSize: RFValue(12),
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: RFValue(10),
    color: Colors.primary,
    fontWeight: '700',
  },

  // Top Companies
  topCompaniesRow: {
    paddingBottom: hp('1%'),
    gap: wp('3%'),
  },
  companyCard: {
    width: wp('25%'),
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  companyLogoWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  companyLogo: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: RFValue(9),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // Departments
  departmentsRow: {
    // paddingBottom: hp('1%'),
    gap: wp('2%'),
  },
  depCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    width: wp('45%'),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  depIconWrap: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  depTextWrap: {
    flex: 1,
  },
  depName: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.3%'),
  },
  depCount: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
  },

  // Promo Banner
  promoBanner: {
    marginTop: hp('3%'),
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

export default CandidateHomeScreen
