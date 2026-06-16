import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { GraduationCap } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

const CandidateEducationCard: React.FC = () => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <GraduationCap size={RFValue(11)} color={Colors.primary} />
          <Text style={styles.sectionCardTitle}>Education</Text>
        </View>
      </View>

      <View style={styles.eduItemRow}>
    

        <View style={styles.eduContentBlock}>
          <Text style={styles.eduDegreeTitle}>Bachelor of Technology (Computer Science)</Text>
          <Text style={styles.eduInstitution}>IIT Delhi • 2015 - 2019</Text>
          <Text style={styles.eduDescription}>Graduated with 8.5 CGPA. Specialized in Mobile Computing.</Text>
        </View>
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
  eduItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eduIconSquare: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3.5%'),
  },
  eduBuildingIcon: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    resizeMode: 'contain',
  },
  eduContentBlock: {
    flex: 1,
  },
  eduDegreeTitle: {
    fontSize: RFValue(9.2),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  eduInstitution: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginVertical: hp('0.2%'),
  },
  eduDescription: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default CandidateEducationCard;
