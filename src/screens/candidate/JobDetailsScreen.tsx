import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar, Pressable, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeft, MapPin, Briefcase, IndianRupee, Send, Clock, Building } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { JobDetailsTabContent, AboutCompanyTabContent, BenefitsTabContent, SimilarJobsTabContent } from '../../components/Candidate_component/JobTabComponents';
import { jobs } from '../../data/jobonnStaticData';
import { logJobView, logCompanyProfileView } from '../../services/firebase/analytics';
import { normalizeBackendJob } from '../../utils/jobNormalizer';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCandidateProfileCompleteness } from '../../utils/candidateProfileCompleteness';
import Toast from 'react-native-toast-message';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const JobDetailsScreen = ({ navigation, route }: any) => {
  const rawJob = route?.params?.job;
  const job = useMemo(() => {
    if (!rawJob) return jobs[0];
    if ('workMode' in rawJob) return rawJob;
    return normalizeBackendJob(rawJob);
  }, [rawJob]);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Failed to load user in JobDetailsScreen:', e);
      }
    };
    loadUser();
  }, []);

  const tabs = useMemo(() => {
    const list = ['Job Details'];
    if (job.company || job.aboutCompany) {
      list.push('About Company');
    }
    if (job.benefits && job.benefits.length > 0) {
      list.push('Benefits');
    }
    // list.push('Similar Jobs');
    return list;
  }, [job]);

  const [activeTab, setActiveTab] = useState('Job Details');
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionLayouts = useRef<{ [key: string]: number }>({});
  const isProgrammaticScroll = useRef(false);

  const applyScale = useSharedValue(1);
  const applyAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: applyScale.value }],
  }));

  useEffect(() => {
    if (job) {
      logJobView(job.id, job.title);
    }
  }, [job]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScroll.current) return;

    const scrollY = event.nativeEvent.contentOffset.y;
    const headerOffset = hp('12%'); // Approximate sticky header height

    let currentTab = tabs[0];
    for (let i = tabs.length - 1; i >= 0; i--) {
      const tabName = tabs[i];
      const tabY = sectionLayouts.current[tabName] || 0;
      // if scrolled past the section start (accounting for sticky header offset)
      if (scrollY + headerOffset >= tabY) {
        currentTab = tabName;
        break;
      }
    }
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
      if (currentTab === 'About Company' && job) {
        logCompanyProfileView(job.companyId || job.company_id || 'static_company_id', job.company);
      }
    }
  };

  const onTabPress = (item: string) => {
    setActiveTab(item);
    if (item === 'About Company' && job) {
      logCompanyProfileView(job.companyId || job.company_id || 'static_company_id', job.company);
    }
    const tabY = sectionLayouts.current[item] || 0;

    // Set flag to ignore scroll events while animating
    isProgrammaticScroll.current = true;

    scrollViewRef.current?.scrollTo({
      y: Math.max(0, tabY - hp('6%')), // Offset for sticky tab bar
      animated: true
    });

    // Reset flag after animation duration
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 400);
  };

  const renderTab = (item: string) => {
    const isActive = activeTab === item;
    return (
      <TouchableOpacity
        key={item}
        style={[styles.tabItem, isActive && styles.activeTabItem]}
        onPress={() => onTabPress(item)}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>{item}</Text>
      </TouchableOpacity>
    );
  };
  const inset = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />



      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[2]}
      >
        <CommanManagerHeader
          title="Job Details"
          navigation={navigation}
          onBack={() => navigation.goBack()}
        />
        {/* Top Info Section */}
        <View style={styles.topSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.companyRow}>
                <Building color={Colors.primary} size={RFValue(11)} />
                <Text style={styles.companyName}>{job.company}</Text>
              </View>
            </View>
            {job.logo ? <Image source={job.logo} style={styles.logo} /> : null}
          </View>

          <View style={styles.tagsRowContainer}>
            <View style={styles.tagsRow}>
              {(() => {
                const tags = [];
                if (job.type) {
                  tags.push(
                    <View key="type" style={styles.tagItem}>
                      <Briefcase color={Colors.textSecondary} size={RFValue(10.5)} />
                      <Text style={styles.tagText}>{job.type}</Text>
                    </View>
                  );
                }
                if (job.salary) {
                  tags.push(
                    <View key="salary" style={styles.tagItem}>
                      <IndianRupee color={Colors.textSecondary} size={RFValue(10.5)} />
                      <Text style={styles.tagText}>{job.salary}</Text>
                    </View>
                  );
                }
                if (job.location) {
                  tags.push(
                    <View key="location" style={styles.tagItem}>
                      <MapPin color={Colors.textSecondary} size={RFValue(10.5)} />
                      <Text style={styles.tagText}>{job.location}</Text>
                    </View>
                  );
                }

                const joined = [];
                for (let i = 0; i < tags.length; i++) {
                  joined.push(tags[i]);
                  if (i < tags.length - 1) {
                    joined.push(<Text key={`div-${i}`} style={styles.tagDivider}>|</Text>);
                  }
                }
                return joined;
              })()}
            </View>
          </View>

          {(job.posted || job.openings || job.applicants) ? (
            <View style={styles.statsRow}>
              {(() => {
                const stats = [];
                if (job.posted) {
                  stats.push(
                    <View key="posted" style={styles.statItem}>
                      <Clock color={Colors.textSecondary} size={RFValue(10.5)} />
                      <Text style={styles.postedText}>Posted: {job.posted}</Text>
                    </View>
                  );
                }
                if (job.openings) {
                  stats.push(
                    <Text key="openings" style={styles.postedText}>Openings: {job.openings}</Text>
                  );
                }
                if (job.applicants !== undefined && job.applicants !== null) {
                  stats.push(
                    <Text key="applicants" style={styles.postedText}>Applicants: {job.applicants}</Text>
                  );
                }

                const joined = [];
                for (let i = 0; i < stats.length; i++) {
                  joined.push(stats[i]);
                  if (i < stats.length - 1) {
                    joined.push(<Text key={`dot-${i}`} style={styles.tagDivider}>•</Text>);
                  }
                }
                return joined;
              })()}
            </View>
          ) : null}
        </View>

        {/* Tabs - Index 2 so it becomes sticky */}
        <View style={styles.stickyTabsWrapper}>
          <View style={styles.tabsContainer}>
            {tabs.map(renderTab)}
          </View>
          <View style={styles.tabBorderBottom} />
        </View>

        {/* Tab Content Stacks */}
        <View style={styles.sectionsContainer}>
          <View style={styles.tabContent} onLayout={(e) => sectionLayouts.current['Job Details'] = e.nativeEvent.layout.y}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <JobDetailsTabContent job={job} />
          </View>

          {(job.company || job.aboutCompany) && (
            <>
              <View style={styles.sectionDivider} />
              <View style={styles.tabContent} onLayout={(e) => sectionLayouts.current['About Company'] = e.nativeEvent.layout.y}>
                <Text style={styles.sectionTitle}>About Company</Text>
                <AboutCompanyTabContent job={job} />
              </View>
            </>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <>
              <View style={styles.sectionDivider} />
              <View style={styles.tabContent} onLayout={(e) => sectionLayouts.current.Benefits = e.nativeEvent.layout.y}>
                {/* <Text style={styles.sectionTitle}>Benefits</Text> */}
                <BenefitsTabContent job={job} />
              </View>
            </>
          )}

          {/* <View style={styles.sectionDivider} />
          <View style={styles.tabContent} onLayout={(e) => sectionLayouts.current['Similar Jobs'] = e.nativeEvent.layout.y}>
            <Text style={styles.sectionTitle}>Similar Jobs</Text>
            <SimilarJobsTabContent currentJobId={job.id} />
          </View> */}
        </View>


        <View style={{ height: hp('8%') }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(inset.bottom, hp('2%')) }]}>
        <AnimatedPressable
          style={[styles.applyBtn, applyAnimStyle]}
          onPressIn={() => applyScale.value = withSpring(0.96)}
          onPressOut={() => applyScale.value = withSpring(1)}
          onPress={() => {

            const completeness = getCandidateProfileCompleteness(user);
            if (completeness.percentage < 90) {
              Toast.show({
                type: 'error',
                text1: 'Profile Incomplete',
                text2: `Please complete your profile to apply (Current progress: ${completeness.percentage}%). Minimum 90% required.`,
              });
              return;
            }
            navigation.navigate('ApplyJobFlow', { job });
          }}
        >
          <Send color={Colors.white} size={RFValue(11)} style={{ marginRight: wp('1%') }} />
          <View style={styles.applyBtnTextContainer}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </View>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: Colors.background,
  },
  iconBtn: {
    padding: wp('1%'),
    backgroundColor: Colors.background,
    borderRadius: wp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    width: wp('10%'),
    justifyContent: 'flex-end'
  },
  saveJobHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1.5%'),
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('1.5%'),
  },
  saveJobHeaderText: {
    fontSize: RFValue(10),
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: hp('4%'),
  },
  topSection: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: Colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: hp('1.5%'),
  },
  logo: {
    width: wp('12%'),
    height: wp('12%'),
    // borderRadius: wp('2%'),
    // borderWidth: 1,
    // borderColor: Colors.borderLight,
  },
  titleInfo: {
    flex: 1,
    paddingRight: wp('3%'),
  },
  jobTitle: {
    fontSize: RFValue(12),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  companyName: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  tagsRowContainer: {
    marginBottom: hp('1%'),
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  tagText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    // fontWeight: '500',
  },
  tagDivider: {
    color: Colors.border,
    fontSize: RFValue(10.5),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  postedText: {
    fontSize: RFValue(9.5),
    color: Colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
  },
  stickyTabsWrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 10,
    marginTop: hp('1%'),
  },
  tabBorderBottom: {
    // height: 1,
    backgroundColor: Colors.border,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionsContainer: {
    backgroundColor: '#F8FAFC', // light background for contrast between cards
    paddingTop: hp('1%'),
  },
  sectionDivider: {
    height: hp('1.5%'),
    backgroundColor: '#F8FAFC',
  },
  tabContent: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('3%'),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: RFValue(12),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: hp('2%'),
  },
  roleBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('1.5%'),
  },
  roleBulletText: {
    fontSize: RFValue(10.5),
    color: Colors.textPrimary,
    flex: 1,
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  perksBox: {
    backgroundColor: Colors.warningLight,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('3%'),
  },
  perksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    marginBottom: hp('1%'),
  },
  perksTitle: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  perksDesc: {
    fontSize: RFValue(10.5),
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
    lineHeight: hp('2.5%'),
  },
  infoList: {
    marginBottom: hp('3%'),
    gap: hp('1.5%'),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  infoText: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
  },
  metaInfo: {
    gap: hp('0.5%'),
    marginBottom: hp('3%'),
  },
  metaText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
    marginVertical: hp('2%'),
  },
  jdMainTitle: {
    fontSize: RFValue(13),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('2%'),
  },
  jdSubTitle: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
  },
  jdText: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
    lineHeight: hp('2.5%'),
  },
  jdBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },
  jdBullet: {
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('0.75%'),
    backgroundColor: Colors.textPrimary,
    marginTop: hp('1%'),
    marginRight: wp('3%'),
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginTop: hp('4%'),
    gap: wp('3%'),
  },
  warningTextContainer: {
    flex: 1,
  },
  warningText: {
    fontSize: RFValue(10.5),
    color: Colors.textSecondary,
    lineHeight: hp('2.2%'),
  },
  warningLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
    gap: wp('3%'),
  },
  bottomSaveBtn: {
    width: wp('22%'),
    height: hp('5.5%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
    gap: wp('1.5%'),
  },
  bottomSaveText: {
    fontSize: RFValue(11),
    color: Colors.primary,
    fontWeight: '700',
  },
  applyBtn: {
    flex: 1,
    height: hp('4%'),
    backgroundColor: Colors.primary,
    borderRadius: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%')
  },
  applyBtnTextContainer: {
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: RFValue(10),
    color: Colors.white,
    fontWeight: '600',
  },
  applyBtnSubText: {
    fontSize: RFValue(8),
    color: Colors.white,
    opacity: 0.8,
  },
});

export default JobDetailsScreen;
