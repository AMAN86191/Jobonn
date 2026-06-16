import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {  PenTool, Building, Users, MapPin, CheckCircle, IndianRupee, Briefcase } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import JobCard from './JobCard';
import { jobs } from '../../data/jobonnStaticData';

export const JobDetailsTabContent = ({ job }: { job?: any }) => (
  <View>
    <View style={styles.infoCard}>
      <View style={styles.cardRow}>
        <Briefcase color={Colors.textSecondary} size={RFValue(13)} />
        <Text style={styles.cardText}>{job?.experience || job?.type || '0-5 Yrs'}</Text>
      </View>
      <View style={styles.cardRow}>
        <Users color={Colors.textSecondary} size={RFValue(13)} />
        <Text style={styles.cardText}>{job?.openings || job?.vacancies || 1} vacancy</Text>
      </View>
      <View style={styles.cardRow}>
        <MapPin color={Colors.textSecondary} size={RFValue(13)} />
        <Text style={styles.cardText}>{job?.location || 'Jaipur'}</Text>
      </View>
      <View style={styles.cardRow}>
        <IndianRupee color={Colors.textSecondary} size={RFValue(13)} />
        <Text style={styles.cardText}>{job?.salary || 'Not disclosed'}</Text>
      </View>
      <View style={styles.cardRow}>
        <PenTool color={Colors.textSecondary} size={RFValue(13)} />
        <Text style={styles.cardText}>{(job?.skills || []).join(', ') || 'React Native, TypeScript, APIs'}</Text>
      </View>
    </View>

    <Text style={styles.jdMainTitle}>Job description</Text>

    <View style={styles.infoCard}>
      <Text style={styles.jdSubTitle}>What you'll do</Text>
      <Text style={styles.jdText}>{job?.description || 'Build reliable mobile hiring workflows and collaborate with product teams.'}</Text>
      {(job?.responsibilities || []).map((item: string) => (
        <Text key={item} style={styles.jdText}>- {item}</Text>
      ))}
      <Text style={[styles.disclaimerText, { marginTop: hp(3) }]}>Static MVP data. Live availability and final details will be confirmed when backend APIs are connected.</Text>
    </View>

    <View style={styles.infoCard}>
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>Industry type</Text>
        <Text style={styles.metaValue}>{job?.category || 'Recruitment Technology'}</Text>
      </View>
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>Department</Text>
        <Text style={styles.metaValue}>{job?.department || 'Engineering'}</Text>
      </View>
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>Role</Text>
        <Text style={styles.metaValue}>{job?.title || 'Front End Developer'}</Text>
      </View>
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>Employment type</Text>
        <Text style={styles.metaValue}>{job?.job_type || 'Full Time'}</Text>
      </View>
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>Education</Text>
        <Text style={styles.metaValue}>{job?.education || 'Graduate'}</Text>
      </View>
    </View>
  </View>
);

export const AboutCompanyTabContent = ({ job }: { job?: any }) => (
  <View>
    <Text style={styles.jdMainTitle}>{job?.company || 'Jobonn Partner'}</Text>
    <Text style={styles.jdText}>{job?.aboutCompany || 'A verified company hiring through the Jobonn recruitment operating system.'}</Text>

    <View style={styles.infoList}>
      <View style={[styles.infoRow, { marginTop: hp(2) }]}>
        <Building color={Colors.textSecondary} size={RFValue(14)} />
        <Text style={styles.infoText}>{job?.category || 'Recruitment Technology'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Users color={Colors.textSecondary} size={RFValue(14)} />
        <Text style={styles.infoText}>Verified employer</Text>
      </View>
      <View style={styles.infoRow}>
        <MapPin color={Colors.textSecondary} size={RFValue(14)} />
        <Text style={styles.infoText}>{job?.location || 'India'}</Text>
      </View>
    </View>
  </View>
);

export const BenefitsTabContent = ({ job }: { job?: any }) => (
  <View>
    <Text style={styles.jdMainTitle}>Employee Benefits</Text>
    {(job?.benefits || ['Health Insurance', 'Flexible Working Hours', 'Performance Bonus']).map((benefit: string) => (
      <View key={benefit} style={styles.roleBulletRow}>
        <CheckCircle color={Colors.success} size={RFValue(14)} />
        <Text style={styles.roleBulletText}>{benefit}</Text>
      </View>
    ))}
  </View>
);

export const SimilarJobsTabContent = ({ currentJobId }: { currentJobId?: string }) => (
  <View style={{ marginTop: hp(1) }}>
    {jobs.filter(item => item.id !== currentJobId).slice(0, 3).map(item => (
      <JobCard
        key={item.id}
        {...item}
        onPress={() => { }}
      />
    ))}
  </View>
);


const styles = StyleSheet.create({
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
    fontSize: RFValue(11),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('2%'),
  },
  jdSubTitle: {
    fontSize: RFValue(11),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
  },
  jdText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
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
  infoCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('2%')
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    gap: wp('3%'),
  },
  cardText: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: hp('2.5%'),
  },
  metaSection: {
    marginBottom: hp('1.5%'),
  },
  metaLabel: {
    fontSize: RFValue(10.5),
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: hp('0.5%'),
  },
  metaValue: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
  },
  disclaimerText: {
    fontSize: RFValue(10.5),
    color: Colors.textSecondary,
    lineHeight: hp('2%'),
  },
});
