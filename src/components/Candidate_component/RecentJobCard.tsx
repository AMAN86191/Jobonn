import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Clock, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface RecentJobCardProps {
  id: string;
  company: string;
  role: string;
  location: string;
  type: string;
  time: string;
}

const RecentJobCard: React.FC<RecentJobCardProps> = ({ company, role, type, time }) => (
  <TouchableOpacity style={styles.recentCard}>
    <View style={styles.recentLogoBox}>
      <Text style={styles.recentLogoText}>{company[0]}</Text>
    </View>
    <View style={styles.recentInfo}>
      <Text style={styles.recentRole}>{role}</Text>
      <Text style={styles.recentCompany}>{company} • {type}</Text>
      <View style={styles.recentMeta}>
        <Clock color={Colors.textSecondary} size={wp('3.5%')} />
        <Text style={styles.recentTime}>{time}</Text>
      </View>
    </View>
    <ChevronRight color={Colors.border} size={wp('5%')} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  recentCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    padding: wp('4%'), borderRadius: wp('4%'), marginBottom: hp('1.5%'),
    borderWidth: 1, borderColor: Colors.border,
  },
  recentLogoBox: {
    width: wp('12%'), height: wp('12%'), borderRadius: wp('3%'),
    backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center',
  },
  recentLogoText: { color: Colors.primary, ...Typography.body },
  recentInfo: { flex: 1, marginLeft: wp('3%') },
  recentRole: { ...Typography.bodySmall },
  recentCompany: { ...Typography.caption, color: Colors.textSecondary },
  recentMeta: { flexDirection: 'row', alignItems: 'center', marginTop: hp('0.5%') },
  recentTime: { ...Typography.caption, color: Colors.textSecondary, marginLeft: wp('1%'), },
});

export default RecentJobCard;
