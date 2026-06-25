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
    case 'selected':
      return { text: 'Selected', color: Colors.success };
    case 'hired':
      return { text: 'Hired', color: Colors.success };
    default:
      return {
        text: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Applied',
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

const AppliedJobsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();
  const { appliedJobs, loading } = useSelector((state: any) => state.candidateJobs);

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
        statusColor: statusDetails.color,
        appliedAt: formattedDate,
        job: normalizedJob,
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

            {normalizedApplications.map((application: any) => (
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
                // onPress={() => navigation.navigate('JobDetails', { job: application.job })}
                // onPress={() => navigation.navigate('JobDetails', { job: application.job })}
                />
              </View>
            ))}
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
});

export default AppliedJobsScreen;
