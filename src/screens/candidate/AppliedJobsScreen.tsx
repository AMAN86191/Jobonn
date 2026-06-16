import React from 'react';
import { View, StyleSheet, ScrollView, Text, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import AppliedJobCard from '../../components/Candidate_component/AppliedJobCard';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApplicationJobs } from '../../data/jobonnStaticData';

const APPLIED_JOBS = getApplicationJobs();

const AppliedJobsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <CommanManagerHeader
          title="Applied Jobs"
          navigation={navigation}
          onBack={() => navigation.goBack()}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          <Text style={styles.resultCount}>{APPLIED_JOBS.length} jobs applied</Text>
          
          {APPLIED_JOBS.map(application => (
            <View key={application.id} style={styles.applicationBlock}>
              <AppliedJobCard
                title={application.job.title}
                company={application.job.company}
                logo={application.job.logo}
                location={application.job.location}
                salary={application.job.salary}
                type={application.job.type}
                status={application.status}
                statusColor={application.statusColor}
                onPress={() => navigation.navigate('JobDetails', { job: application.job })}
              />
              <View style={styles.timelineCard}>
                <Text style={styles.timelineTitle}>Hiring progress</Text>
                <View style={styles.timelineRow}>
                  {application.timeline.map((step, index) => (
                    <View key={step} style={styles.timelineItem}>
                      <View style={[styles.timelineDot, index === application.timeline.length - 1 && styles.timelineDotActive]} />
                      <Text style={styles.timelineText}>{step}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.nextStep}>{application.nextStep}</Text>
              </View>
            </View>
          ))}
          <View style={{ height: hp('5%') }} />
        </ScrollView>
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
    marginBottom: hp('1.5%'),
  },
  applicationBlock: {
    marginBottom: hp('1.5%'),
  },
  timelineCard: {
    marginTop: -hp('0.5%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: wp('3%'),
    padding: wp('3%'),
  },
  timelineTitle: {
    fontSize: RFValue(9),
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: hp('0.8%'),
  },
  timelineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginBottom: hp('0.5%'),
  },
  timelineDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.border,
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
  },
  timelineText: {
    fontSize: RFValue(7.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  nextStep: {
    marginTop: hp('0.5%'),
    fontSize: RFValue(8),
    color: Colors.primary,
    fontWeight: '700',
  },
  cardContainer: {
    marginBottom: hp('1.5%'),
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('1.2%'),
    paddingTop: hp('0.5%'),
    backgroundColor: Colors.white,
  },
  statusLabel: {
    fontSize: RFValue(9),
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('1.5%'),
  },
  statusText: {
    fontSize: RFValue(8.5),
    fontWeight: '700',
  },
});

export default AppliedJobsScreen;
