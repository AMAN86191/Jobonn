import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Circle } from 'react-native-svg';
import { getCandidateProfileCompleteness } from '../../utils/candidateProfileCompleteness';

interface CandidateProfileCompletenessBannerProps {
  user: any;
  navigation: any;
}

const CandidateProfileCompletenessBanner: React.FC<CandidateProfileCompletenessBannerProps> = ({ user, navigation }) => {
  const completeness = user ? getCandidateProfileCompleteness(user) : null;

  if (!user || !completeness || completeness.isComplete) {
    return null;
  }

  const getCompletenessColor = (percent: number) => {
    if (percent < 40) return Colors.warning;
    if (percent < 80) return Colors.warning;
    return Colors.primary;
  };

  const completenessColor = getCompletenessColor(completeness.percentage);

  const handlePress = () => {
    navigation.navigate('CompleteProfile', {
      role: 'candidate',
      user: user,
    });
  };

  return (
    <TouchableOpacity
      style={styles.profileBanner}
      activeOpacity={0.95}
      onPress={handlePress}
    >
      <View style={styles.profileBannerContent}>
        <View style={styles.profileBannerLeft}>
          <Text style={styles.profileBannerTitle}>Complete Your Profile</Text>
          <Text style={styles.profileBannerSub}>
            Fill in your details to stand out to employers and find your dream job faster.
          </Text>
        </View>

        <View style={styles.profileBannerRight}>
          <View style={styles.circularProgressContainer}>
            <Svg width={RFValue(28)} height={RFValue(28)} viewBox="0 0 54 54">
              <Circle
                cx="27"
                cy="27"
                r="23"
                stroke="#E5E7EB"
                strokeWidth="5"
                fill="transparent"
              />
              <Circle
                cx="27"
                cy="27"
                r="23"
                stroke={completenessColor}
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 23}
                strokeDashoffset={2 * Math.PI * 23 - (2 * Math.PI * 23 * completeness.percentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 27 27)"
              />
            </Svg>
            <View style={styles.circularProgressTextContainer}>
              <Text style={[styles.circularProgressText, { color: completenessColor }]}>
                {completeness.percentage}%
              </Text>
            </View>
          </View>
          <View style={[styles.profileBannerBtnRound, { backgroundColor: completenessColor }]}>
            <ChevronRight size={RFValue(10)} color={Colors.white} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileBanner: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('4%'),
    marginBottom: hp('1.5%'),
    marginTop: hp('1%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },
  profileBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('4%'),
  },
  profileBannerLeft: {
    flex: 1,
    paddingRight: wp('2%'),
  },
  profileBannerTitle: {
    fontSize: RFValue(10.5),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: hp('0.3%'),
  },
  profileBannerSub: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '500',
    lineHeight: hp('1.7%'),
  },
  profileBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  circularProgressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(28),
    height: RFValue(28),
  },
  circularProgressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    fontSize: RFValue(7.2),
    fontWeight: '800',
  },
  profileBannerBtnRound: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default CandidateProfileCompletenessBanner;
