import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Briefcase, BookOpen, Users, TrendingUp } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

interface RecruitmentStatsRowProps {
  postedJobs: number;
  totalApplicants: number;
  shortlisted: number;
  hired: number;
}

export const RecruitmentStatsRow: React.FC<RecruitmentStatsRowProps> = React.memo(({
  postedJobs = 0,
  totalApplicants = 0,
  shortlisted = 0,
  hired = 0,
}) => {
  return (
    <View style={styles.statsRow}>
      {/* Posted Jobs */}
      <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: '#EEF1FF' }]}>
          <Briefcase color={Colors.primary} size={RFValue(11)} />
        </View>
        <View>
          <Text style={styles.statValue}>{postedJobs}</Text>
          <Text style={styles.statLabel}>Posted Jobs</Text>
        </View>
      </View>

      {/* Total Applicants */}
      <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: '#EFF6FF' }]}>
          <BookOpen color="#3B82F6" size={RFValue(11)} />
        </View>
        <View>
          <Text style={[styles.statValue, { color: '#3B82F6' }]}>{totalApplicants}</Text>
          <Text style={styles.statLabel}>Total Applicants</Text>
        </View>
      </View>

      {/* Shortlisted */}
      <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: '#ECFDF5' }]}>
          <Users color="#10B981" size={RFValue(11)} />
        </View>
        <View>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{shortlisted}</Text>
          <Text style={styles.statLabel}>Shortlisted</Text>
        </View>
      </View>

      {/* Hired */}
      <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: '#FFF7ED' }]}>
          <TrendingUp color="#F97316" size={RFValue(11)} />
        </View>
        <View>
          <Text style={[styles.statValue, { color: '#F97316' }]}>{hired}</Text>
          <Text style={styles.statLabel}>Hired</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
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
});

export default RecruitmentStatsRow;
