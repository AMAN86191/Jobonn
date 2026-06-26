import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, ImageSourcePropType } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronRight, MapPin, Briefcase, IndianRupee } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import StatusBadge, { StatusType } from './StatusBadge';
import { RFValue } from 'react-native-responsive-fontsize';

interface CandidateCardProps {
  name: string;
  role: string;
  experience: string;
  location: string;
  status?: StatusType;
  currentCTC?: string;
  expectedCTC?: string;
  time: string;
  onPress?: () => void;
  avatarColor?: string;
  image?: ImageSourcePropType;
  appliedJob?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  name, role, experience, location, status, currentCTC, expectedCTC, time, onPress, avatarColor, image, appliedJob
}) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const bgColor = avatarColor ?? Colors.primary;

  // Calculate fallbacks cleanly
  const currentVal = currentCTC || '';
  const expectedVal = expectedCTC || (currentVal.includes('LPA')
    ? `${parseInt(currentVal)} LPA`
    : '');

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.avatar, !image && { backgroundColor: bgColor + '18' }]}>
          {image ? (
            <Image source={image} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarText, { color: bgColor }]}>{initials}</Text>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role} numberOfLines={1}>{role}</Text>
          {appliedJob ? (
            <View style={styles.appliedJobBadge}>
              <Text style={styles.appliedJobText}>Applied: {appliedJob}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          {status && <StatusBadge status={status} />}
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <View style={styles.metaItem}>
            <Briefcase color={Colors.textSecondary} size={RFValue(8)} strokeWidth={2.5} />
            <Text style={styles.metaText}>{experience}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin color={Colors.textSecondary} size={RFValue(8)} strokeWidth={2.5} />
            <Text style={styles.metaText}>{location}</Text>
          </View>
          {experience?.toLowerCase() !== 'fresher' && (currentVal || expectedVal) ? (
            <View style={styles.metaItem}>
              <IndianRupee color={Colors.textSecondary} size={RFValue(8)} strokeWidth={2.5} />
              <Text style={styles.metaText}>{currentVal} (Cur) • {expectedVal} (Exp)</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={styles.viewDetailsBtn} onPress={onPress} activeOpacity={0.7}>
          <Text style={styles.viewDetailsText}>View</Text>
          <ChevronRight color={Colors.primary} size={RFValue(9)} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const AVATAR_COLORS = [Colors.primary, Colors.info, Colors.success, Colors.warning, Colors.secondary];
export const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    padding: wp('2.5%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: hp('0.6%') },
  avatar: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: { fontWeight: '800', fontSize: RFValue(9) },
  info: { flex: 1 },
  name: { fontSize: RFValue(9.5), fontWeight: '600', color: Colors.textPrimary, marginBottom: hp('0.1%') },
  role: { fontSize: RFValue(8), color: Colors.textSecondary },
  headerRight: { alignItems: 'flex-end', gap: hp('0.3%') },
  time: { fontSize: RFValue(7), color: Colors.textTertiary },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('0.5%'),
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: wp('2%'),
    gap: wp('1.5%'),
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1.5%'),
    gap: wp('1%'),
  },
  metaText: { fontSize: RFValue(7.5), color: Colors.textSecondary },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('0.2%'),
  },
  viewDetailsText: { fontSize: RFValue(8), color: Colors.primary, fontWeight: '700' },
  appliedJobBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.25%'),
    borderRadius: wp('1%'),
    marginTop: hp('0.3%'),
  },
  appliedJobText: {
    fontSize: RFValue(7),
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default CandidateCard;
