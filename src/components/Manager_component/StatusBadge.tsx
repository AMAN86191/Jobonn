import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

export type StatusType =
  | 'New'
  | 'Shortlisted'
  | 'Interview'
  | 'Offered'
  | 'Hired'
  | 'Rejected'
  | 'Active'
  | 'Paused'
  | 'Closed'
  | 'Pending';

const STATUS_CONFIG: Record<StatusType, { bg: string; color: string; dot?: boolean }> = {
  New:         { bg: Colors.infoLight,    color: Colors.info,          dot: true },
  Shortlisted: { bg: Colors.primaryLight, color: Colors.primary,       dot: true },
  Interview:   { bg: Colors.warningLight, color: Colors.warning,       dot: true },
  Offered:     { bg: Colors.successLight, color: Colors.success,       dot: true },
  Hired:       { bg: Colors.successLight, color: Colors.success,       dot: false },
  Rejected:    { bg: Colors.dangerLight,  color: Colors.danger,        dot: false },
  Active:      { bg: Colors.successLight, color: Colors.success,       dot: true },
  Paused:      { bg: Colors.warningLight, color: Colors.warning,       dot: false },
  Closed:      { bg: Colors.borderLight,  color: Colors.textSecondary, dot: false },
  Pending:     { bg: Colors.infoLight,    color: Colors.info,          dot: true },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  const isLarge = size === 'md';

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, isLarge && styles.badgeLg]}>
      {cfg.dot && <View style={[styles.dot, { backgroundColor: cfg.color }]} />}
      <Text style={[styles.text, { color: cfg.color }, isLarge && styles.textLg]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('4%'),
  },
  badgeLg: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
  },
  dot: {
    width: wp('1.2%'),
    height: wp('1.2%'),
    borderRadius: wp('0.8%'),
    marginRight: wp('1%'),
  },
  text: {
    fontSize: RFValue(7.5),
    fontWeight: '700',
  },
  textLg: {
    fontSize: RFValue(8.5),
  },
});

export default StatusBadge;
