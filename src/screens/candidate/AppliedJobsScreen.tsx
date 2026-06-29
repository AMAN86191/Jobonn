import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, StatusBar, ActivityIndicator, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import AppliedJobCard from '../../components/Candidate_component/AppliedJobCard';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppliedJobsSlice } from '../../redux/CandidateJobSlice';
import { normalizeBackendJob } from '../../utils/jobNormalizer';
import { Briefcase } from 'lucide-react-native';

const getStatusDetails = (status: string) => {
  const normalizedStatus = (status || '').toLowerCase();
  switch (normalizedStatus) {
    case 'applied':
      return { text: 'Applied', color: Colors.info };
    case 'shortlisted':
      return { text: 'Shortlisted', color: Colors.warning };
    case 'rejected':
      return { text: 'Rejected', color: Colors.danger };
    case 'interview_schedule':
    case 'interview':
      return { text: 'Interview Scheduled', color: Colors.primary };
    case 'selected':
      return { text: 'Selected', color: Colors.success };
    case 'hired':
      return { text: 'Hired', color: Colors.success };
    default:
      return {
        text: status ? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : 'Applied',
        color: Colors.primary
      };
  }
};

const formatAppliedDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const formattedStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
    const date = new Date(formattedStr);
    const now = new Date();

    // Reset hours to check day differences
    const dateCopy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowCopy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = nowCopy.getTime() - dateCopy.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      // Format as "DD MMM YYYY"
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  } catch (error) {
    return '';
  }
};

const formatTo12Hour = (timeStr: string) => {
  if (!timeStr) return 'N/A';
  try {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0]);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
  } catch (e) {
    console.log('Error formatting time:', e);
  }
  return timeStr;
};

const AppliedJobsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();
  const { appliedJobs, loading } = useSelector((state: any) => state.candidateJobs);
  console.log('appliedJobs', appliedJobs)
  useEffect(() => {
    dispatch(fetchAppliedJobsSlice());
  }, [dispatch]);

  const normalizedApplications = useMemo(() => {
    return (appliedJobs || []).map((app: any) => {
      const normalizedJob = normalizeBackendJob(app.job);
      const statusDetails = getStatusDetails(app.status);
      const formattedDate = formatAppliedDate(app.applied_at);
      return {
        id: app.id,
        status: statusDetails.text,
        rawStatus: app.status,
        statusColor: statusDetails.color,
        appliedAt: formattedDate,
        job: normalizedJob,
        interviewDate: app.interview_date,
        interviewTime: formatTo12Hour(app.interview_time),
        interviewType: app.interview_type,
      };  
    });
  }, [appliedJobs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <CommanManagerHeader
          title="Applied Jobs"
          navigation={navigation}
          onBack={() => navigation.goBack()}
        />

        {loading && appliedJobs.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : normalizedApplications.length === 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.emptyContainer}
          >
            <View style={styles.emptyIconContainer}>
              <Briefcase size={RFValue(28)} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Applied Jobs</Text>
            <Text style={styles.emptySub}>
              You haven't applied to any jobs yet. Browse available jobs and start applying!
            </Text>
            <Pressable
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('CandidateTabNavigator', { screen: 'JobsTab' })}
            >
              <Text style={styles.exploreBtnText}>Explore Jobs</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            <Text style={styles.resultCount}>
              {normalizedApplications.length} {normalizedApplications.length === 1 ? 'job' : 'jobs'} applied
            </Text>

            {normalizedApplications.map((application: any) => {
              const showInterview = application.rawStatus?.toLowerCase() === 'interview_schedule' || 
                                    application.rawStatus?.toLowerCase() === 'interview';
              return (
                <View key={application.id} style={styles.applicationBlock}>
                  <AppliedJobCard
                    title={application.job.title}
                    company={application.job.company}
                    logo={application.job.logo}
                    location={application.job.location}
                    salary={application.job.salary}
                    type={application.job.job_type || application.job.type}
                    status={application.status}
                    statusColor={application.statusColor}
                    appliedAt={application.appliedAt}
                  />
                  {showInterview && (
                    <View style={styles.interviewDetailsCard}>
                      <Text style={styles.interviewDetailsTitle}>Interview Scheduled</Text>
                      <View style={styles.interviewDetailsGrid}>
                        <View style={styles.interviewDetailRow}>
                          <Text style={styles.interviewDetailLabel}>Type: </Text>
                          <Text style={styles.interviewDetailVal}>
                            {application.interviewType ? (application.interviewType.charAt(0).toUpperCase() + application.interviewType.slice(1)) : 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.interviewDetailRow}>
                          <Text style={styles.interviewDetailLabel}>Date: </Text>
                          <Text style={styles.interviewDetailVal}>{application.interviewDate || 'N/A'}</Text>
                        </View>
                        <View style={styles.interviewDetailRow}>
                          <Text style={styles.interviewDetailLabel}>Time: </Text>
                          <Text style={styles.interviewDetailVal}>{application.interviewTime || 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
            <View style={{ height: hp('5%') }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
  },
  resultCount: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
  applicationBlock: {
    marginBottom: hp('0.1%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
    paddingTop: hp('15%'),
  },
  emptyIconContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  emptyTitle: {
    fontSize: RFValue(14),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptySub: {
    fontSize: RFValue(10.5),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('2.2%'),
    marginBottom: hp('3%'),
  },
  exploreBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
  },
  exploreBtnText: {
    color: Colors.white,
    fontSize: RFValue(11),
    fontWeight: '700',
  },
  interviewDetailsCard: {
    backgroundColor: '#F5F7FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: wp('2.5%'),
    padding: wp('3%'),
    marginTop: -hp('0.6%'),
    marginBottom: hp('1.2%'),
  },
  interviewDetailsTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '800',
    color: '#3730A3',
    marginBottom: hp('0.6%'),
  },
  interviewDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  interviewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interviewDetailLabel: {
    fontSize: RFValue(8.2),
    color: '#4338CA',
    fontWeight: '600',
  },
  interviewDetailVal: {
    fontSize: RFValue(8.2),
    color: '#1E1B4B',
    fontWeight: '700',
  },
});

export default AppliedJobsScreen;
