import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Briefcase } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

interface CandidateWorkExperienceProps {
  experiences?: any[];
}

const CandidateWorkExperience: React.FC<CandidateWorkExperienceProps> = ({ experiences = [] }) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Briefcase size={RFValue(11)} color={Colors.primary} />
          <Text style={styles.sectionCardTitle}>Work Experience</Text>
        </View>
      </View>

      <View style={styles.timelineContainer}>
        {experiences.length === 0 ? (
          <Text style={styles.timelineDesc}>No work experience details added (Fresher).</Text>
        ) : (
          experiences.map((exp: any, index: number) => {
            const isLast = index === experiences.length - 1;
            const jobTitle = exp.position || exp.job_title || 'Position';
            const companyName = exp.company || exp.company_name || '';
            const duration = exp.duration || '';
            const dateRange = exp.startDate && exp.endDate
              ? `${exp.startDate} - ${exp.endDate}`
              : (exp.endDate || exp.startDate || '');
            
            return (
              <View key={index} style={[styles.timelineItem, isLast && { paddingBottom: 0 }]}>
                <View style={styles.timelineIndicator}>
                  <View style={index === 0 ? styles.timelineDotActive : styles.timelineDotInactive} />
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                
                <View style={styles.timelineContent}>
                  <View style={styles.timelineTitleRow}>
                    <Text style={styles.timelineJobTitle}>{jobTitle}</Text>
                    {duration ? (
                      <View style={styles.durationPill}>
                        <Text style={styles.durationPillText}>{duration}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.timelineCompany}>
                    {companyName}{dateRange ? ` • ${dateRange}` : ''}
                  </Text>
                  {exp.description ? (
                    <Text style={styles.timelineDesc}>
                      {exp.description}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('3.5%'),
    marginBottom: hp('1.2%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
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
  timelineContainer: {
    paddingLeft: wp('1%'),
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: hp('1.8%'),
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: wp('3%'),
    width: wp('3%'),
  },
  timelineDotActive: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#EEF1FF',
  },
  timelineDotInactive: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.textTertiary,
  },
  timelineLine: {
    width: 1.5,
    backgroundColor: '#E5E7EB',
    flex: 1,
    marginTop: hp('0.5%'),
  },
  timelineContent: {
    flex: 1,
    marginTop: -hp('0.2%'),
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineJobTitle: {
    fontSize: RFValue(9.2),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  durationPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 4,
  },
  durationPillText: {
    fontSize: RFValue(7.2),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  timelineCompany: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginVertical: hp('0.4%'),
  },
  timelineDesc: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    lineHeight: RFValue(11.5),
    fontWeight: '500',
  },
});

export default CandidateWorkExperience;
