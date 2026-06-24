import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Building2 } from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface AboutCompanyCardProps {
  bio: string;
}

export const AboutCompanyCard: React.FC<AboutCompanyCardProps> = React.memo(({ bio }) => {
  if (!bio) return null;

  return (
    <RAnimated.View entering={FadeInDown.duration(400).delay(150)} style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Building2 color={Colors.primary} size={RFValue(11)} />
          <Text style={styles.sectionCardTitle}>About Company</Text>
        </View>
      </View>

      <View style={styles.aboutRow}>
        <View style={styles.aboutLeft}>
          <Text style={styles.aboutText}>{bio}</Text>
        </View>
      </View>
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
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('0.7%'),
  },
  aboutLeft: {},
  aboutText: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    lineHeight: RFValue(12),
    fontWeight: '500',
    textAlign: 'justify',
  },
});

export default AboutCompanyCard;
