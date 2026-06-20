import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Briefcase, ChevronRight } from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface OpenPosition {
  id: string;
  title: string;
  location: string;
  type: string;
}

interface OpenPositionsCarouselProps {
  positions: OpenPosition[];
  onViewAllJobs: () => void;
  onViewJobDetails: (jobId: string) => void;
}

export const OpenPositionsCarousel: React.FC<OpenPositionsCarouselProps> = React.memo(({
  positions,
  onViewAllJobs,
  onViewJobDetails,
}) => {
  if (!positions || positions.length === 0) return null;

  return (
    <RAnimated.View entering={FadeInDown.duration(400).delay(200)} style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Briefcase color={Colors.primary} size={RFValue(11)} />
          <Text style={styles.sectionCardTitle}>Open Positions</Text>
        </View>
        <TouchableOpacity onPress={onViewAllJobs}>
          <Text style={styles.viewAllJobsLink}>View All Jobs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobsHorizontalScroll}>
        {positions.map((job) => (
          <View key={job.id} style={styles.jobScrollCard}>
            <Text style={styles.jobScrollTitle} numberOfLines={2}>{job.title}</Text>
            <View style={styles.jobScrollFooter}>
              <View style={styles.openingsDotRow}>
                <View style={styles.greenDot} />
                <Text style={styles.openingsText} numberOfLines={1}>
                  {job.location} • {job.type}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.jobScrollArrow}
                onPress={() => onViewJobDetails(job.id)}
              >
                <ChevronRight size={RFValue(10.5)} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </RAnimated.View>
  );
});

const styles = StyleSheet.create({
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
    marginBottom: hp('1%'),
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
    flex: 1,
    marginRight: wp('2%'),
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
    flex: 1,
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
});

export default OpenPositionsCarousel;
