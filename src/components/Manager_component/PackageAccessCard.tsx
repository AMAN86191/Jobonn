import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Award } from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface PackageAccessCardProps {
  packageName: string;
  duration: number | string | null;
  expiryDate: string | null;
}

const formatRenewalDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    // Check if valid date
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  } catch (e) {
    return dateStr;
  }
};

const formatDuration = (val: any) => {
  if (val === null || val === undefined || val === '') return 'N/A';
  if (typeof val === 'number' || !isNaN(Number(val))) {
    const num = Number(val);
    return `${num} Month${num > 1 ? 's' : ''}`;
  }
  return String(val);
};

export const PackageAccessCard: React.FC<PackageAccessCardProps> = React.memo(({
  packageName,
  duration,
  expiryDate,
}) => {
  if (!packageName || packageName === 'No Active Package') {
    return null;
  }

  return (
    <RAnimated.View entering={FadeInDown.duration(400).delay(80)} style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Award color={Colors.primary} size={RFValue(11)} />
          <Text style={styles.sectionCardTitle}>Package & Company Access</Text>
        </View>
      </View>
      <View style={styles.packageRow}>
        {/* Active Package */}
        <View style={styles.packageMetric}>
          <Text style={styles.packageValue} numberOfLines={1}>{packageName}</Text>
          <Text style={styles.packageLabel}>Active Package</Text>
        </View>

        {/* Duration */}
        <View style={styles.packageMetric}>
          <Text style={styles.packageValue} numberOfLines={1}>{formatDuration(duration)}</Text>
          <Text style={styles.packageLabel}>Duration</Text>
        </View>

        {/* Expiry Date */}
        <View style={styles.packageMetric}>
          <Text style={styles.packageValue} numberOfLines={1}>{formatRenewalDate(expiryDate)}</Text>
          <Text style={styles.packageLabel}>Expiry Date</Text>
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
  packageRow: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginTop: hp('0.5%'),
  },
  packageMetric: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    padding: wp('2.5%'),
  },
  packageValue: {
    fontSize: RFValue(8.5),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  packageLabel: {
    fontSize: RFValue(7),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.2%'),
  },
});

export default PackageAccessCard;
