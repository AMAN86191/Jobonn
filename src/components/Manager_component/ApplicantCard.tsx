import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface ApplicantCardProps {
  name: string;
  role: string;
  status: string;
  time: string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ name, role, status, time }) => (
  <TouchableOpacity style={styles.applicantCard}>
    <View style={styles.applicantAvatar}>
      <Text style={styles.avatarTextSmall}>{name[0]}</Text>
    </View>
    <View style={styles.applicantInfo}>
      <Text style={styles.applicantName}>{name}</Text>
      <Text style={styles.applicantRole}>{role}</Text>
    </View>
    <View style={styles.applicantMeta}>
      <View style={[styles.statusBadge, { 
        backgroundColor: status === 'New' ? Colors.primary + '15' : Colors.success + '15' 
      }]}>
        <Text style={[styles.statusText, { 
          color: status === 'New' ? Colors.primary : Colors.success 
        }]}>{status}</Text>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  applicantCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    padding: wp('4%'), borderRadius: wp('4%'), marginBottom: hp('1.5%'),
    borderWidth: 1, borderColor: Colors.border,
  },
  applicantAvatar: {
    width: wp('10%'), height: wp('10%'), borderRadius: wp('2.5%'),
    backgroundColor: Colors.secondary + '20', justifyContent: 'center', alignItems: 'center',
  },
  avatarTextSmall: { color: Colors.secondary, ...Typography.body },
  applicantInfo: { flex: 1, marginLeft: wp('3%') },
  applicantName: { ...Typography.bodySmall,  },
  applicantRole: { ...Typography.caption, color: Colors.textSecondary },
  applicantMeta: { alignItems: 'flex-end' },
  statusBadge: {
    paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.3%'),
    borderRadius: wp('1.5%'), marginBottom: hp('0.5%'),
  },
  statusText: { ...Typography.caption, fontWeight: '700' },
  timeText: { ...Typography.caption, color: Colors.textSecondary },
});

export default ApplicantCard;
