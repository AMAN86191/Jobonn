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
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  name, role, experience, location, status, currentCTC, expectedCTC, time, onPress, avatarColor, image
}) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const bgColor = avatarColor ?? Colors.primary;
  console.log('image', image);

  // Calculate fallbacks cleanly
  const currentVal = currentCTC || '18 LPA';
  const expectedVal = expectedCTC || (currentVal.includes('LPA')
    ? `${parseInt(currentVal) + 4} LPA`
    : '22 LPA');

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
        </View>
        <View style={styles.headerRight}>
          {status && <StatusBadge status={status} />}
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <View style={styles.metaItem}>
            <Briefcase color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
            <Text style={styles.metaText}>{experience}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaItem}>
            <MapPin color={Colors.textTertiary} size={RFValue(8)}  />
            <Text style={styles.metaText}>{location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaItem}>
            <IndianRupee color={Colors.textTertiary} size={RFValue(8)}  />
            <Text style={styles.metaText}>{currentVal} (Cur) • {expectedVal} (Exp)</Text>
          </View>
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
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: hp('0.8%') },
  avatar: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.5%'),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: { fontWeight: '800', fontSize: RFValue(10) },
  info: { flex: 1 },
  name: { fontSize: RFValue(10.5), fontWeight: '400', color: Colors.textPrimary, marginBottom: hp('0.15%') },
  role: { fontSize: RFValue(8.5), color: Colors.textSecondary },
  headerRight: { alignItems: 'flex-end', gap: hp('0.4%') },
  time: { fontSize: RFValue(7.5), color: Colors.textTertiary },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: wp('2%'),
    rowGap: hp('0.5%'),
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: wp('0.8%') },
  metaText: { fontSize: RFValue(8.5), color: Colors.textSecondary },
  divider: { width: 1, height: hp('1.2%'), backgroundColor: Colors.border, marginHorizontal: wp('1.5%') },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('0.2%'),
  },
  viewDetailsText: { fontSize: RFValue(8.5), color: Colors.primary, fontWeight: '700' },
});

export default CandidateCard;
