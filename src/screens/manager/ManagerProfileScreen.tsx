import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Building2,
  MapPin,
  Globe,
  LogOut,
  ChevronRight,
  Edit3,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  ExternalLink,
  Calendar,
  FileText,
} from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import AwardsAndRecognitions from '../../components/Manager_component/AwardsAndRecognitions';
import ContactCardScreen from '../../components/Manager_component/ContactCardScreen';
import { recruiterProfile, managedCompanies, packages } from '../../data/jobonnStaticData';
const ManagerProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Profile state data
  const [user, setUser] = useState<any>({
    name: '',
    email: '',
    phone: '',
    manager_profile: {},
    stats: {}
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      setUser(recruiterProfile);
    } catch (error) {
      console.error('Error fetching manager profile:', error);
      ToastAndroid.show('Failed to load profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    navigation.navigate('ManagerEditProfile', { user });
  };

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, hp('12%')) }]}
      >
        {/* Cover Identity Card */}
        <RAnimated.View entering={FadeInDown.duration(400)} style={styles.identityCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop' }}
            style={styles.coverBanner}
          />
          <View style={styles.identityMain}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>T</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <View style={styles.verifiedDot} />
              </View>
            </View>

            <View style={styles.companyTitleContainer}>
              <Text style={styles.profileName}>{user.manager_profile?.companyName}</Text>
              <Award color={Colors.primary} size={RFValue(11)} />
            </View>

            <View style={styles.companyLocationRow}>
              <MapPin color={Colors.textSecondary} size={RFValue(9.5)} />
              <Text style={styles.locationText}>{user.manager_profile?.location}</Text>
            </View>

            {/* Badges strip */}
            <View style={styles.badgesStrip}>
              <View style={styles.stripBadge}>
                <Building2 size={RFValue(9)} color={Colors.textSecondary} />
                <Text style={styles.stripBadgeText}>{user.manager_profile?.industry}</Text>
              </View>

              <View style={styles.stripBadge}>
                <Users size={RFValue(9)} color={Colors.textSecondary} />
                <Text style={styles.stripBadgeText}>{user.manager_profile?.companySize}</Text>
              </View>
            </View>

            {/* Website Link */}
            <TouchableOpacity
              style={styles.webLinkRow}
              onPress={() => Linking.openURL('https://' + user.manager_profile?.website)}
            >
              <Globe size={RFValue(9.5)} color={Colors.primary} />
              <Text style={styles.webLinkText}>www.{user.manager_profile?.website}</Text>
              <ExternalLink size={RFValue(8.5)} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </RAnimated.View>

        {/* Dynamic Recruitment Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#EEF1FF' }]}>
              <Briefcase color={Colors.primary} size={RFValue(11)} />
            </View>
            <View>
              <Text style={styles.statValue}>{user.stats?.postedJobs}</Text>
              <Text style={styles.statLabel}>Posted Jobs</Text>
            </View>
          </View>

          {/* Total Applicants */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#EFF6FF' }]}>
              <BookOpen color="#3B82F6" size={RFValue(11)} />
            </View>
            <View>
              <Text style={[styles.statValue, { color: '#3B82F6' }]}>{user.stats?.totalApplicants}</Text>
              <Text style={styles.statLabel}>Total Applicants</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#ECFDF5' }]}>
              <Users color="#10B981" size={RFValue(11)} />
            </View>
            <View>
              <Text style={[styles.statValue, { color: '#10B981' }]}>{user.stats?.shortlisted}</Text>
              <Text style={styles.statLabel}>Shortlisted</Text>
            </View>
          </View>



          {/* Hiring Rate */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF7ED' }]}>
              <TrendingUp color="#F97316" size={RFValue(11)} />
            </View>
            <View>
              <Text style={[styles.statValue, { color: '#F97316' }]}>{user.stats?.hired}</Text>
              <Text style={styles.statLabel}>Hired</Text>
            </View>
          </View>
        </View>

        <RAnimated.View entering={FadeInDown.duration(400).delay(80)} style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Award color={Colors.primary} size={RFValue(11)} />
              <Text style={styles.sectionCardTitle}>Package & Company Access</Text>
            </View>
          </View>
          <View style={styles.packageRow}>
            <View style={styles.packageMetric}>
              <Text style={styles.packageValue}>{packages.find(item => item.active)?.name}</Text>
              <Text style={styles.packageLabel}>Active Package</Text>
            </View>
            <View style={styles.packageMetric}>
              <Text style={styles.packageValue}>{managedCompanies.length}</Text>
              <Text style={styles.packageLabel}>Companies</Text>
            </View>
            <View style={styles.packageMetric}>
              <Text style={styles.packageValue}>{user.manager_profile?.verificationStatus}</Text>
              <Text style={styles.packageLabel}>Verification</Text>
            </View>
          </View>
        </RAnimated.View>

        {/* Recruiter Details Card */}
        <RAnimated.View entering={FadeInDown.duration(400).delay(100)} style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <User color={Colors.primary} size={RFValue(11)} />
              <Text style={styles.sectionCardTitle}>Recruiter Details</Text>
            </View>
          </View>

          <View style={styles.recruiterProfileBlock}>
            <View style={styles.recruiterAvatarWrapper}>
              <View style={styles.recruiterAvatar}>
                <Text style={styles.recruiterAvatarText}>TM</Text>
              </View>
              <View style={styles.recruiterActiveIndicator} />
            </View>

            <View style={styles.recruiterInfoBlock}>
              <Text style={styles.recruiterNameText}>{user.name}</Text>
              <Text style={styles.recruiterRoleText}>{user.manager_profile?.jobTitle}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp('0.5%'), gap: wp('1.5%') }}>
                <Calendar size={RFValue(8.5)} color={Colors.textSecondary} />
                <Text style={{ fontSize: RFValue(8), color: Colors.textSecondary, fontWeight: '500' }}>Joined May 2024</Text>
              </View>
            </View>
          </View>

          <View style={styles.dividerLight} />
          <ContactCardScreen />

          {/* <View style={styles.recruiterContactRow}>
            <View style={styles.recruiterContactLeft}>
              <Mail size={RFValue(10.5)} color={Colors.textSecondary} />
              <Text style={styles.recruiterContactVal}>{email}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Copied', 'Email copied to clipboard!')}>
              <Copy size={RFValue(10.5)} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.recruiterContactRow}>
            <View style={styles.recruiterContactLeft}>
              <Phone size={RFValue(10.5)} color={Colors.textSecondary} />
              <Text style={styles.recruiterContactVal}>{phone}</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
              <Phone color={Colors.textSecondary} size={RFValue(10.5)} />
            </TouchableOpacity>
          </View>
          <View style={styles.recruiterContactRow}>
            <View style={styles.recruiterContactLeft}>
              <Image source={require('../../../assets/images/whatsapp_bold.png')} style={{ width: RFValue(10.5), height: RFValue(10.5), tintColor: Colors.textSecondary }} resizeMode="contain" />
              <Text style={styles.recruiterContactVal}>WhatsApp</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${phone}`)}>
              <Image source={require('../../../assets/images/whatsapp_bold.png')} style={{ width: RFValue(12), height: RFValue(12), tintColor: Colors.textSecondary }} resizeMode="contain" />
            </TouchableOpacity>
          </View> */}
        </RAnimated.View>

        {/* About Company Card */}
        <RAnimated.View entering={FadeInDown.duration(400).delay(150)} style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Building2 color={Colors.primary} size={RFValue(11)} />
              <Text style={styles.sectionCardTitle}>About Company</Text>
            </View>
          </View>

          <View style={styles.aboutRow}>
            <View style={styles.aboutLeft}>
              <Text style={styles.aboutText}>{user.manager_profile?.bio}</Text>
            </View>
            {/* 
            <View style={{ height: hp('8%'), justifyContent: 'center', alignItems: 'center' }}>
              <LottieView
                source={require('../../../assets/lotie/company.json')}
                autoPlay
                loop
                style={{
                  width: wp('40%'),
                  height: wp('40%')
                }}
              />
            </View> */}
          </View>
        </RAnimated.View>
        {/* Company Information Card */}
        <RAnimated.View entering={FadeInDown.duration(400).delay(250)} style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Building2 color={Colors.primary} size={RFValue(11)} />
              <Text style={styles.sectionCardTitle}>Company Information</Text>
            </View>
          </View>

          <View style={styles.infoGridContainer}>
            <View style={styles.infoGridRow}>
              {/* Industry */}
              <View style={styles.infoGridCell}>
                <View style={styles.infoGridIconBg}>
                  <Building2 size={RFValue(9.5)} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoGridLabel}>Industry</Text>
                  <Text style={styles.infoGridVal}>{user.manager_profile?.industry}</Text>
                </View>
              </View>

              {/* Company Size */}
              <View style={styles.infoGridCell}>
                <View style={styles.infoGridIconBg}>
                  <Users size={RFValue(9.5)} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoGridLabel}>Company Size</Text>
                  <Text style={styles.infoGridVal}>{user.manager_profile?.companySize}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoGridRow}>
              {/* GST Number */}
              <View style={styles.infoGridCell}>
                <View style={styles.infoGridIconBg}>
                  <FileText size={RFValue(9.5)} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoGridLabel}>GST Number</Text>
                  <Text style={styles.infoGridVal}>{user.manager_profile?.gstNumber}</Text>
                </View>
              </View>
              <View style={styles.infoGridCell}>
                <View style={styles.infoGridIconBg}>
                  <Calendar size={RFValue(9.5)} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoGridLabel}>Founded In</Text>
                  <Text style={styles.infoGridVal}>{user.manager_profile?.foundedIn}</Text>
                </View>
              </View>


            </View>
            <View style={styles.infoGridRow}>
              {/* Headquarters */}
              <View style={styles.infoGridCell}>
                <View style={styles.infoGridIconBg}>
                  <MapPin size={RFValue(9.5)} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoGridLabel}>Office Location</Text>
                  <Text style={styles.infoGridVal}>{user.manager_profile?.headquarters}</Text>
                </View>
              </View>


            </View>
          </View>

          <View style={styles.dividerLight} />

          {/* Social Links Row */}
          <View style={styles.socialRow}>
            <Text style={styles.socialLabel}>Social Links</Text>
            <View style={styles.socialIconsRow}>
              <TouchableOpacity style={styles.socialIconBadge}>
                <Image
                  source={require('../../../assets/images/linkedin.png')}
                  style={styles.socialImg}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBadge}>
                <Image
                  source={require('../../../assets/images/google.png')}
                  style={[styles.socialImg]}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBadge}>
                <Image
                  source={require('../../../assets/images/insta.png')}
                  style={styles.socialImg}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconBadge}>
                <Image
                  source={require('../../../assets/images/github.png')}
                  style={styles.socialImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        </RAnimated.View>

        {/* Awards & Recognitions Component */}
        <AwardsAndRecognitions awards={user.manager_profile?.awards || []} />

        {/* Open Positions Card */}
        <RAnimated.View entering={FadeInDown.duration(400).delay(200)} style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Briefcase color={Colors.primary} size={RFValue(11)} />
              <Text style={styles.sectionCardTitle}>Open Positions</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ManagerAllJobs')}>
              <Text style={styles.viewAllJobsLink}>View All Jobs</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobsHorizontalScroll}>
            {user.manager_profile?.openPositions?.map((job: any) => (
              <View key={job.id} style={styles.jobScrollCard}>
                <Text style={styles.jobScrollTitle}>{job.title}</Text>
                <View style={styles.jobScrollFooter}>
                  <View style={styles.openingsDotRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.openingsText}>{job.location} • {job.type}</Text>
                  </View>
                  <TouchableOpacity style={styles.jobScrollArrow} onPress={() => navigation.navigate('ManagerJobDetails')}>
                    <ChevronRight size={RFValue(10.5)} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </RAnimated.View>





        {/* Recent Activity Card */}
        {/* <RAnimated.View entering={FadeInDown.duration(400).delay(350)} style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Clock color={Colors.primary} size={RFValue(11)} />
              <Text style={styles.sectionCardTitle}>Recent Activity</Text>
            </View>

          </View>

          <View style={styles.activityList}>
          
            <View style={styles.activityItem}>
              <View style={styles.greenBullet} />
              <Text style={styles.activityDesc}>Posted a new job "Senior React Native Developer"</Text>
              <Text style={styles.activityTime}>2h ago</Text>
            </View>

           <View style={styles.activityItem}>
              <View style={styles.greenBullet} />
              <Text style={styles.activityDesc}>Shortlisted a candidate for "Backend Developer"</Text>
              <Text style={styles.activityTime}>5h ago</Text>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.greenBullet} />
              <Text style={styles.activityDesc}>New application received for "UI/UX Designer"</Text>
              <Text style={styles.activityTime}>1d ago</Text>
            </View>
          </View>
        </RAnimated.View> */}

        {/* Additional Options Card
        <RAnimated.View entering={FadeInDown.duration(400).delay(400)} style={styles.sectionCard}>
          <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('ManagerInterviews')}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBg}>
                <Calendar color={Colors.primary} size={RFValue(10.5)} />
              </View>
              <Text style={styles.optionText}>Scheduled Interviews</Text>
            </View>
            <ChevronRight color={Colors.textTertiary} size={RFValue(10.5)} />
          </TouchableOpacity>
          
          <View style={styles.dividerLight} />
          
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.optionIconBg}>
                <FileText color={Colors.primary} size={RFValue(10.5)} />
              </View>
              <Text style={styles.optionText}>Terms and Conditions</Text>
            </View>
            <ChevronRight color={Colors.textTertiary} size={RFValue(10.5)} />
          </TouchableOpacity>
        </RAnimated.View> */}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login', params: { role: 'company' } }],
            })
          }
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
  safe: { flex: 1, backgroundColor: '#F8F9FC' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.6%'),
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
  identityCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: hp('1.2%'),
  },
  coverBanner: {
    height: hp('9.5%'),
    width: '100%',
    resizeMode: 'cover',
  },
  identityMain: {
    alignItems: 'center',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  avatarWrapper: {
    marginTop: -wp('9%'),
    position: 'relative',
    marginBottom: hp('1%'),
  },
  avatar: {
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
  },
  avatarText: {
    color: Colors.white,
    fontSize: RFValue(20),
    fontWeight: '800',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -1,
    right: -2,
    backgroundColor: '#10B981',
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: wp('2.75%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  verifiedDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.white,
  },
  companyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('0.3%'),
  },
  profileName: {
    fontSize: RFValue(12),
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  companyLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginBottom: hp('1.2%'),
  },
  locationText: {
    fontSize: RFValue(8.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  badgesStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginBottom: hp('1.2%'),
  },
  stripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    backgroundColor: '#F3F4F6',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 6,
  },
  stripBadgeText: {
    fontSize: RFValue(7.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  webLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginTop: hp('0.3%'),
  },
  webLinkText: {
    fontSize: RFValue(8.8),
    color: Colors.primary,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    gap: wp('1.8%'),
    marginBottom: hp('1.2%'),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: wp('2.2%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconContainer: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  statValue: {
    fontSize: RFValue(11.5),
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: RFValue(6.8),
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp('0.1%'),
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('2%'),
    marginBottom: hp('1%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  sectionCardTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  packageRow: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginTop: hp('0.5%'),
  },
  packageMetric: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    padding: wp('2.5%'),
  },
  packageValue: {
    fontSize: RFValue(8.5),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  packageLabel: {
    fontSize: RFValue(7),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.2%'),
  },
  contactRecruiterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderRadius: 6,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
  },
  contactRecruiterText: {
    fontSize: RFValue(7.8),
    color: Colors.primary,
    fontWeight: '700',
  },

  recruiterProfileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  recruiterAvatarWrapper: {
    position: 'relative',
    marginRight: wp('3%'),
  },
  recruiterAvatar: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recruiterAvatarText: {
    fontSize: RFValue(10.5),
    color: Colors.primary,
    fontWeight: '700',
  },
  recruiterActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp('2.8%'),
    height: wp('2.8%'),
    borderRadius: wp('1.4%'),
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  recruiterInfoBlock: {
    flex: 1,
  },
  recruiterNameText: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recruiterRoleText: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.1%'),
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: hp('1.2%'),
  },
  recruiterContactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.4%'),
    marginBottom: hp('0.6%'),
  },
  recruiterContactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  recruiterContactVal: {
    fontSize: RFValue(8.8),
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingVertical: hp('0.7%')
    // gap: wp('2%'),
  },
  aboutLeft: {
    // width: wp('80%'),
  },
  aboutText: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    lineHeight: RFValue(12),
    fontWeight: '500',
    textAlign: "justify"
  },



  viewAllJobsLink: {
    fontSize: RFValue(8.2),
    color: Colors.primary,
    fontWeight: '700',
  },
  jobsHorizontalScroll: {
    flexDirection: 'row',
    marginTop: hp('0.5%'),
  },
  jobScrollCard: {
    width: wp('42%'),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: wp('3%'),
    marginRight: wp('2.8%'),
  },
  jobScrollTitle: {
    fontSize: RFValue(8.8),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('1%')
  },
  jobScrollFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openingsDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  greenDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#10B981',
  },
  openingsText: {
    fontSize: RFValue(7.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  jobScrollArrow: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoGridContainer: {
    marginTop: hp('0.5%'),
  },
  infoGridRow: {
    flexDirection: 'row',
    marginBottom: hp('1.2%'),
  },
  infoGridCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  infoGridIconBg: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: 8,
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoGridLabel: {
    fontSize: RFValue(6.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoGridVal: {
    fontSize: RFValue(8.2),
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: hp('0.1%'),
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('0.5%'),
  },
  socialLabel: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  socialIconBadge: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialImg: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
  },

  cultureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.5%'),
  },
  cultureItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp('1%'),
  },
  cultureIconBg: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.6%'),
  },
  cultureTitle: {
    fontSize: RFValue(7.8),
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cultureSub: {
    fontSize: RFValue(6.2),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: hp('0.15%'),
    fontWeight: '500',
  },

  viewAllActivityLink: {
    fontSize: RFValue(8.2),
    color: Colors.primary,
    fontWeight: '700',
  },
  activityList: {
    marginTop: hp('0.5%'),
    gap: hp('1%'),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.4%'),
  },
  greenBullet: {
    width: wp('1.8%'),
    height: wp('1.8%'),
    borderRadius: wp('0.9%'),
    backgroundColor: '#10B981',
    marginRight: wp('2.5%'),
  },
  activityDesc: {
    flex: 1,
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: RFValue(7.8),
    color: Colors.textTertiary,
    fontWeight: '600',
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  optionIconBg: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: RFValue(9),
    color: Colors.textPrimary,
    fontWeight: '600',
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
  iconBtn: { backgroundColor: Colors.white, padding: wp('1.5%'), borderRadius: wp('2%'), borderWidth: 1, borderColor: '#F3F4F6' },
  inputWrap: { marginBottom: hp('1.5%') },
  inputLabel: { fontSize: RFValue(9), color: Colors.textSecondary, marginBottom: hp('0.5%'), fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: wp('2%'), paddingHorizontal: wp('3%'), paddingVertical: hp('1%'), fontSize: RFValue(10), color: Colors.textPrimary, backgroundColor: Colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: wp('5%'), borderTopRightRadius: wp('5%'), padding: wp('4%'), maxHeight: hp('80%') },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('2%') },
  modalTitle: { fontSize: RFValue(12), fontWeight: '700', color: Colors.textPrimary },
  closeBtn: { padding: wp('1%'), backgroundColor: '#F3F4F6', borderRadius: wp('2%') },
  saveBtn: { backgroundColor: Colors.primary, paddingVertical: hp('1.5%'), borderRadius: wp('2.5%'), alignItems: 'center', marginTop: hp('2%') },
  saveBtnText: { fontSize: RFValue(11), fontWeight: '700', color: Colors.white },
});

export default ManagerProfileScreen;
