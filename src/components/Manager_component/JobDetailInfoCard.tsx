import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Users, Clock, MapPin, Briefcase, ChevronDown, ChevronUp, Zap,
  GraduationCap, IndianRupee, Heart, Monitor, Gift, LayoutGrid
} from 'lucide-react-native';
import RAnimated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface JobDetailInfoCardProps {
  job: any;
  stats: any[];
  jobStatus?: string;
  onStatusPress?: () => void;
}

const JobDetailInfoCard: React.FC<JobDetailInfoCardProps> = ({ job, stats, jobStatus, onStatusPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadgeStyle = (status?: string) => {
    const s = (status || 'Active').toLowerCase();
    switch (s) {
      case 'active':
        return { bg: '#ECFDF5', text: '#10B981' };
      case 'closed':
      case 'deactive':
      case 'inactive':
        return { bg: Colors.dangerLight, text: Colors.danger };
      case 'draft':
        return { bg: Colors.borderLight, text: Colors.textSecondary };
      case 'expired':
        return { bg: Colors.warningLight, text: Colors.warning };
      default:
        return { bg: '#ECFDF5', text: '#10B981' };
    }
  };

  const statusStyle = getStatusBadgeStyle(jobStatus);

  // Fallbacks matching the premium image exactly
  const displayTitle = job.title || '';
  const displayDept = job.department || '';
  const displayLocation = job.location || '';
  const displaySalary = job.salary || '';
  const displayDescription = job.description || '';
  const displayExperience = job.experience || job.type || '';
  const displayEducation = job.education || '';
  const displayOpenings = job.openings || job.vacancies || '0';
  const displayCategory = job.category || '';
  const displayJobType = job.job_type || '';

  const skillItems = React.useMemo(() => {
    if (job.skills && Array.isArray(job.skills) && job.skills.length > 0) {
      return job.skills;
    }
    const rawSkills = job.rawJob?.skills || job.rawJob?.job_skills || job.skills || [];
    if (Array.isArray(rawSkills)) {
      return rawSkills.map((s: any) => typeof s === 'string' ? s : (s.skill_name || s.name || '')).filter(Boolean);
    }
    if (typeof rawSkills === 'string') {
      return rawSkills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  }, [job.skills, job.rawJob]);
  const benefitItems = job.benefits || [];

  return (
    <>
      <RAnimated.View
        entering={FadeInDown.duration(400).delay(100)}
        layout={Layout.springify()} 
        style={styles.jobCard}
      >
        {/* Header Section */}
        <View style={styles.jobHeader}>
          <View style={{ flex: 1, paddingRight: wp('2%') }}>
            <Text style={styles.jobTitle}>{displayTitle}</Text>
            <Text style={styles.jobDept}>
              {displayDept}
              {job.posted ? ` • Posted ${job.posted}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onStatusPress}
            activeOpacity={0.7}
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg }
            ]}
          >
            <Text style={[
              styles.statusText,
              { color: statusStyle.text }
            ]}>
              {jobStatus || 'Active'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Info Row (Location & Salary) */}
        <View style={styles.mainInfoRow}>
          <View style={styles.mainInfoLeft}>
            {!!displayLocation && (
              <View style={styles.mainInfoItem}>
                <MapPin size={RFValue(10)} color={Colors.textSecondary} />
                <Text style={styles.mainInfoText}>{displayLocation}</Text>
              </View>
            )}
            {!!displayLocation && !!displaySalary && <View style={styles.verticalDivider} />}
            {!!displaySalary && (
              <View style={styles.mainInfoItem}>
                <IndianRupee size={RFValue(10)} color={Colors.textSecondary} />
                <Text style={styles.mainInfoText}>{displaySalary}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandBtnText}>{isExpanded ? 'View Less' : 'View Details'}</Text>
            {isExpanded ? (
              <ChevronUp size={RFValue(10)} color={Colors.primary} strokeWidth={2.5} />
            ) : (
              <ChevronDown size={RFValue(10)} color={Colors.primary} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <RAnimated.View entering={FadeInDown.duration(300)} style={styles.expandedContent}>
            <View style={styles.horizontalDivider} />

            {/* About the Role */}
            {!!displayDescription && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionHeader}>About the Role</Text>
                <Text style={styles.descriptionText}>{displayDescription}</Text>
              </View>
            )}

            {/* Details Grid Table */}
            <View style={styles.gridContainer}>
              {/* Row 1 */}
              <View style={styles.gridRow}>
                <View style={styles.gridCell}>
                  <View style={styles.gridIconBg}>
                    <Clock size={RFValue(12)} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.gridLabel}>Experience</Text>
                    <Text style={styles.gridValue}>{displayExperience || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.gridCellNoRight}>
                  <View style={styles.gridIconBg}>
                    <GraduationCap size={RFValue(12)} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.gridLabel}>Education</Text>
                    <Text style={styles.gridValue}>{displayEducation || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              {/* Row 2 */}
              <View style={styles.gridRow}>
                <View style={styles.gridCell}>
                  <View style={styles.gridIconBg}>
                    <Users size={RFValue(12)} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.gridLabel}>Openings</Text>
                    <Text style={styles.gridValue}>{displayOpenings}</Text>
                  </View>
                </View>
                <View style={styles.gridCellNoRight}>
                  <View style={styles.gridIconBg}>
                    <LayoutGrid size={RFValue(12)} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.gridLabel}>Category</Text>
                    <Text style={styles.gridValue}>{displayCategory || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              {/* Row 3 */}
              <View style={[styles.gridRow, { borderBottomWidth: 0 }]}>
                <View style={styles.gridCell}>
                  <View style={styles.gridIconBg}>
                    <Briefcase size={RFValue(12)} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.gridLabel}>Job Type</Text>
                    <Text style={styles.gridValue}>{displayJobType || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.gridCellNoRight}>
                  <View style={styles.gridIconBg}>
                    <MapPin size={RFValue(12)} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.gridLabel}>Location</Text>
                    <Text style={styles.gridValue}>{displayLocation || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Required Skills */}
            {skillItems.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionHeader}>Required Skills</Text>
                <View style={styles.skillsContainer}>
                  {skillItems.map((skill: string) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Benefits */}
            {benefitItems.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionHeader}>Benefits</Text>
                <View style={styles.benefitsRow}>
                  {benefitItems.map((benefit: string, idx: number) => {
                    let IconComponent = Gift;
                    const name = benefit.toLowerCase();
                    if (name.includes('health') || name.includes('insurance') || name.includes('medical')) {
                      IconComponent = Heart;
                    } else if (name.includes('hour') || name.includes('flexible') || name.includes('time')) {
                      IconComponent = Clock;
                    } else if (name.includes('remote') || name.includes('wfh') || name.includes('work')) {
                      IconComponent = Monitor;
                    } else if (name.includes('bonus') || name.includes('performance') || name.includes('incentive')) {
                      IconComponent = Gift;
                    }

                    return (
                      <View key={idx} style={styles.benefitChip}>
                        <IconComponent size={RFValue(10)} color={Colors.primary} />
                        <Text style={styles.benefitChipText}>{benefit}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Urgently Hiring Badge */}
            {!!job.rawJob?.is_urgent && (
              <View style={styles.urgentlyHiringContainer}>
                <Zap size={RFValue(12)} color={Colors.primary} fill={Colors.primary} />
                <Text style={styles.urgentlyHiringText}>Urgently Hiring</Text>
              </View>
            )}
          </RAnimated.View>
        )}
      </RAnimated.View>

      {/* Separate Stats Card */}
      <RAnimated.View
        entering={FadeInDown.duration(400).delay(150)}
        style={styles.statsCard}
      >
        {stats.map((stat, i) => (
          <React.Fragment key={i}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <stat.icon size={RFValue(13)} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
            {i < stats.length - 1 && <View style={styles.statsVerticalDivider} />}
          </React.Fragment>
        ))}
      </RAnimated.View>
    </>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
  },
  jobTitle: {
    fontSize: RFValue(12),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  jobDept: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    marginTop: hp('0.3%'),
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 20,
  },
  statusText: {
    fontSize: RFValue(9),
    color: '#10B981',
    fontWeight: '700',
  },
  mainInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  mainInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  mainInfoText: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  verticalDivider: {
    width: 1,
    height: hp('1.8%'),
    backgroundColor: Colors.border,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  expandBtnText: {
    fontSize: RFValue(9),
    color: Colors.primary,
    fontWeight: '600',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: hp('1%'),
  },
  expandedContent: {
    marginTop: 0,
  },
  detailSection: {
    marginBottom: hp('1%'),
  },
  sectionHeader: {
    fontSize: RFValue(10),
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: hp('0.7%'),
  },
  descriptionText: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    lineHeight: RFValue(12),
  },

  gridContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    marginBottom: hp('1%'),
  },
  gridRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  gridCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2.5%'),
    gap: wp('2.5%'),
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  gridCellNoRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2%'),
    gap: wp('2.5%'),
  },
  gridIconBg: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('2%'),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: RFValue(7),
    color: Colors.textSecondary,
    marginBottom: hp('0.2%'),
  },
  gridValue: {
    fontSize: RFValue(9),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  skillChip: {
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '25',
  },
  skillChipText: {
    fontSize: RFValue(9),
    color: Colors.primary,
    fontWeight: '600',
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginTop: hp('0.5%'),
  },
  benefitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '08',
    borderColor: Colors.primary + '20',
    borderWidth: 1,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 8,
    gap: wp('1.5%'),
  },
  benefitChipText: {
    fontSize: RFValue(9),
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  urgentlyHiringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF1FF',
    borderRadius: 12,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    gap: wp('2%'),
    marginTop: hp('1%'),
  },
  urgentlyHiringText: {
    fontSize: RFValue(9.5),
    color: Colors.primary,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: hp('1.8%'),
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('0.3%'),
  },
  statValue: {
    fontSize: RFValue(12.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statsVerticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
});

export default JobDetailInfoCard;
