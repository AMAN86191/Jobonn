import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

export type StatusType = string;

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot?: boolean }> = {
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
  Invited:     { bg: Colors.primaryLight, color: Colors.primary,       dot: true },
  Sent:        { bg: Colors.primaryLight, color: Colors.primary,       dot: true },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const statusStr = String(status || '').trim();
  let normalizedStatus = 'Pending';

  const lower = statusStr.toLowerCase();
  if (lower === 'sent') normalizedStatus = 'Sent';
  else if (lower === 'invited') normalizedStatus = 'Invited';
  else if (lower === 'accepted') normalizedStatus = 'Accepted';
  else if (lower === 'rejected') normalizedStatus = 'Rejected';
  else if (lower === 'shortlisted') normalizedStatus = 'Shortlisted';
  else if (lower === 'interview') normalizedStatus = 'Interview';
  else if (lower === 'offered') normalizedStatus = 'Offered';
  else if (lower === 'hired') normalizedStatus = 'Hired';
  else if (lower === 'active') normalizedStatus = 'Active';
  else if (lower === 'paused') normalizedStatus = 'Paused';
  else if (lower === 'closed') normalizedStatus = 'Closed';
  else if (lower === 'new') normalizedStatus = 'New';
  else {
    normalizedStatus = statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
  }

  const cfg = STATUS_CONFIG[normalizedStatus] ?? STATUS_CONFIG.Pending;
  const isLarge = size === 'md';

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, isLarge && styles.badgeLg]}>
      {cfg.dot && <View style={[styles.dot, { backgroundColor: cfg.color }]} />}
      <Text style={[styles.text, { color: cfg.color }, isLarge && styles.textLg]}>{normalizedStatus}</Text>
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
