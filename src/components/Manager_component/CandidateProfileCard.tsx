import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Briefcase, MapPin } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

interface CandidateProfileCardProps {
  applicant: any;
}

const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({ applicant }) => {
  if (!applicant) return null;

  const displayExperience = applicant.experience || 'Fresher';
  const displayLocation = applicant.location || 'Bangalore';
  const displayNoticePeriod = applicant.noticePeriod || '15 days';
  const displayMatchScore = applicant.matchScore || '92';

  const imageUrl = applicant.profile_image || applicant.image?.uri || applicant.rawApplication?.candidate?.profile_img || applicant.profile_img;
  const finalImageUrl = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : `https://admin.jobonn.in/storage/${imageUrl}`)
    : '';

  const size = wp('14%');
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const scoreValue = parseInt(displayMatchScore, 10) || 0;
  const strokeDashoffset = circumference - (circumference * scoreValue) / 100;

  return (
    <View style={styles.profileCard}>
      {/* Header section with avatar, info and circular progress */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatar]}>
          {finalImageUrl ? (
            <Image source={{ uri: finalImageUrl }} style={styles.avatarImage} />
          ) : (
            <Image source={require("../../../assets/images/boy.png")} style={styles.avatarImage} />
          )}
        </View>

        <View style={styles.profileMeta}>
          <Text style={styles.name}>{applicant.name}</Text>
          <Text style={styles.roleText}>{applicant.role || 'React Native Developer'}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Briefcase size={RFValue(8.5)} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{displayExperience}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={RFValue(8.5)} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{displayLocation}</Text>
            </View>
          </View>
        </View>

        {/* Match Circular Indicator */}
        <View style={styles.matchCircleContainer}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
              <Circle
                stroke="#EEF1FF"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke={Colors.primary}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                originX={size / 2}
                originY={size / 2}
              />
            </Svg>
            <View style={styles.matchCircleTrack}>
              <Text style={styles.matchScoreVal}>{displayMatchScore}%</Text>
              <Text style={styles.matchScoreLbl}>Match</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* CTC Breakdown Grid */}
      <View style={styles.ctcRow}>
        {displayExperience.toLowerCase() !== 'fresher' && (
          <>
            <View style={styles.ctcItemSmall}>
              <Text style={styles.ctcLabel}>Current CTC</Text>
              <Text style={styles.ctcValueSmall}>{applicant.currentCTC || 'Not Disclosed'}</Text>
            </View>
            <View style={styles.verticalDivider} />
          </>
        )}
        <View style={styles.ctcItemSmall}>
          <Text style={styles.ctcLabel}>Notice Period</Text>
          <Text style={styles.ctcValueSmall}>{displayNoticePeriod}</Text>
        </View>
        {displayExperience.toLowerCase() !== 'fresher' && (
          <>
            <View style={styles.verticalDivider} />
            <View style={styles.ctcItemSmall}>
              <Text style={styles.ctcLabel}>Expected CTC</Text>
              <Text style={styles.ctcValueSmall}>{applicant.expectedCTC || 'Not Disclosed'}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp('3.5%'),
    marginBottom: hp('1.2%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp('13.5%'),
    height: wp('13.5%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3.5%'),
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  avatarImage: {
    width: wp('13.5%'),
    height: wp('13.5%'),
    resizeMode: 'cover',
    borderRadius: 12,
  },
  profileMeta: {
    flex: 1,
  },
  name: {
    fontSize: RFValue(11.5),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.1%'),
  },
  roleText: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: hp('0.4%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp('2.5%'),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  metaText: {
    fontSize: RFValue(7.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  statusBadgeSmall: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.2%'),
    borderRadius: 4,
  },
  statusTextSmall: {
    fontSize: RFValue(6.8),
    fontWeight: '700',
    color: '#10B981',
  },
  matchCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
  },
  matchCircleTrack: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchScoreVal: {
    fontSize: RFValue(9.5),
    fontWeight: '800',
    color: Colors.primary,
  },
  matchScoreLbl: {
    fontSize: RFValue(6.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: hp('1.2%'),
  },
  ctcRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctcItemSmall: {
    flex: 1,
    alignItems: 'center',
  },
  ctcLabel: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: hp('0.2%'),
  },
  ctcValueSmall: {
    fontSize: RFValue(9.8),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    height: hp('2.5%'),
  },
});

export default CandidateProfileCard;
