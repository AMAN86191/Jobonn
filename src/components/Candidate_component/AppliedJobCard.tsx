import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MapPin, IndianRupee, Clock } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface AppliedJobCardProps {
  title: string;
  company: string;
  logo: any;
  location: string;
  salary: string;
  type: string;
  status: string;
  statusColor: string;
  appliedAt?: string;
  onPress?: () => void;
}

const AppliedJobCard: React.FC<AppliedJobCardProps> = ({
  title, company, logo, location, salary, type, status, statusColor, appliedAt, onPress
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {logo ? (
            <Image source={logo} style={styles.logo} />
          ) : (
            <Text style={styles.logoPlaceholder}>{company.charAt(0)}</Text>
          )}
        </View>
        <View style={styles.companyBlock}>
          <Text style={styles.company} numberOfLines={1}>{company}</Text>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <MapPin color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
          <Text style={styles.tagText}>{location}</Text>
        </View>
        <View style={styles.tag}>
          <IndianRupee color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
          <Text style={styles.tagText}>{salary}</Text>
        </View>
        <View style={styles.typeChip}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.timeWrap}>
          <Clock color={Colors.textTertiary} size={RFValue(8.5)} />
          <Text style={styles.timeText}>
            {appliedAt ? `Applied ${appliedAt}` : 'Applied recently'}
          </Text>
        </View>
        {/* <Pressable style={styles.detailsBtn} onPress={onPress}>
          <Text style={styles.detailsText}>View Details</Text>
        </Pressable> */}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('1.2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
    gap: wp('2.5%'),
  },
  logoContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    flexShrink: 0,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.primary,
  },
  companyBlock: { flex: 1 },
  company: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: hp('0.2%'),
  },
  title: {
    fontSize: RFValue(11),
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: hp('2.1%'),
  },
  statusBadge: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('1.5%'),
  },
  statusText: {
    fontSize: RFValue(8.5),
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2.5%'),
    marginBottom: hp('1.2%'),
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('0.8%'),
  },
  tagText: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  typeChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.2%'),
    borderRadius: wp('1.5%'),
  },
  typeText: {
    fontSize: RFValue(8),
    color: Colors.primary,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: hp('1%'),
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  timeText: {
    fontSize: RFValue(8.5),
    color: Colors.textTertiary,
  },
  detailsBtn: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  detailsText: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default AppliedJobCard;
