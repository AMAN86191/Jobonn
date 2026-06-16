import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Users, Clock, UserCheck, Calendar, MapPin, Briefcase, Building } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import StatusBadge, { StatusType } from './StatusBadge';
import { RFValue } from 'react-native-responsive-fontsize';

interface ActiveJobCardProps {
  title: string;
  department?: string;
  location?: string;
  vacancies?: number;
  applicants: number;
  shortlisted?: number;
  interviewed?: number;
  views: string;
  status: StatusType;
  daysLeft?: number;
  onPress?: () => void;
  onMore?: () => void;
}

const ActiveJobCard: React.FC<ActiveJobCardProps> = ({
  title, department, location, vacancies, applicants, shortlisted = 0, interviewed = 0, status, daysLeft, onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {department && (
            <View style={styles.deptRow}>
              <Building color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
              <Text style={styles.deptText}>{department}</Text>
            </View>
          )}
        </View>
        <StatusBadge status={status} />
      </View>

      <View style={styles.detailsRow}>
        {location && (
          <View style={styles.detailItem}>
            <MapPin color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
            <Text style={styles.detailText}>{location}</Text>
          </View>
        )}
        {vacancies !== undefined && (
          <View style={styles.detailItem}>
            <Briefcase color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
            <Text style={styles.detailText}>{vacancies} Openings</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Users color={Colors.primary} size={RFValue(8.5)} strokeWidth={2} />
          <Text style={[styles.statText, { color: Colors.primary }]}>{applicants} Applied</Text>
        </View>
        {shortlisted > 0 && (
          <View style={styles.stat}>
            <UserCheck color={Colors.success} size={RFValue(8.5)} strokeWidth={2} />
            <Text style={[styles.statText, { color: Colors.success }]}>{shortlisted} Shortlisted</Text>
          </View>
        )}
        {interviewed > 0 && (
          <View style={styles.stat}>
            <Calendar color={Colors.warning} size={RFValue(8.5)} strokeWidth={2} />
            <Text style={[styles.statText, { color: Colors.warning }]}>{interviewed} {status === 'Closed' ? 'Hired' : 'Interviews'}</Text>
          </View>
        )}
        {daysLeft !== undefined && (
          <View style={[styles.daysChip, { backgroundColor: daysLeft < 5 ? Colors.dangerLight : Colors.borderLight }]}>
            <Clock color={daysLeft < 5 ? Colors.danger : Colors.textTertiary} size={RFValue(7.5)} strokeWidth={2} />
            <Text style={[styles.daysText, { color: daysLeft < 5 ? Colors.danger : Colors.textTertiary }]}>
              {daysLeft}d left
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: wp('3%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1.2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: hp('0.8%') },
  titleBlock: { flex: 1, paddingRight: wp('2%') },
  title: { fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: hp('0.3%') },
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: wp('1%') },
  deptText: { fontSize: RFValue(8.5), color: Colors.textTertiary },
  detailsRow: {
    flexDirection: 'row',
    gap: wp('4%'),
    marginBottom: hp('1%'),
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: wp('1%') },
  detailText: { fontSize: RFValue(8.5), color: Colors.textSecondary },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: wp('4%'),
    rowGap: hp('0.5%'),
    paddingTop: hp('0.8%'),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: wp('1%') },
  statText: { fontSize: RFValue(8.5), fontWeight: '600' },
  daysChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('0.8%'),
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.25%'),
    borderRadius: wp('2%'),
    marginLeft: 'auto',
  },
  daysText: { fontSize: RFValue(8), fontWeight: '600' },
});

export default ActiveJobCard;
