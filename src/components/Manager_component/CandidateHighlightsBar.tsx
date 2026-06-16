import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Calendar, User, GraduationCap, MapPin } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

interface CandidateHighlightsBarProps {
  noticePeriod?: string;
  experience?: string;
  education?: string;
  location?: string;
}

const CandidateHighlightsBar: React.FC<CandidateHighlightsBarProps> = ({
  noticePeriod = '15 Days',
  experience = '4 Years',
  education = 'B.Tech',
  location = 'Bangalore',
}) => {
  return (
    <View style={styles.highlightsBar}>
      <View style={styles.highlightItem}>
        <Calendar size={RFValue(11)} color={Colors.textPrimary} />
        <View style={styles.highlightTextContainer}>
          <Text style={styles.highlightLbl}>Notice Period</Text>
          <Text style={styles.highlightVal}>{noticePeriod}</Text>
        </View>
      </View>
      <View style={styles.highlightsDivider} />

      <View style={styles.highlightItem}>
        <User size={RFValue(11)} color={Colors.textPrimary} />
        <View style={styles.highlightTextContainer}>
          <Text style={styles.highlightLbl}>Total Experience</Text>
          <Text style={styles.highlightVal}>{experience}</Text>
        </View>
      </View>
      <View style={styles.highlightsDivider} />

      <View style={styles.highlightItem}>
        <GraduationCap size={RFValue(11)} color={Colors.textPrimary} />
        <View style={styles.highlightTextContainer}>
          <Text style={styles.highlightLbl}>Education</Text>
          <Text style={styles.highlightVal}>{education}</Text>
        </View>
      </View>
      <View style={styles.highlightsDivider} />

      <View style={styles.highlightItem}>
        <MapPin size={RFValue(11)} color={Colors.textPrimary} />
        <View style={styles.highlightTextContainer}>
          <Text style={styles.highlightLbl}>Location</Text>
          <Text style={styles.highlightVal}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  highlightsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2.5%'),
    marginBottom: hp('1.2%'),
  },
  highlightItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },
  highlightTextContainer: {
    flex: 1,
  },
  highlightLbl: {
    fontSize: RFValue(6.5),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  highlightVal: {
    fontSize: RFValue(7.8),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: hp('0.1%'),
  },
  highlightsDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    height: hp('2.5%'),
    alignSelf: 'center',
    marginHorizontal: wp('1.5%'),
  },
});

export default CandidateHighlightsBar;
