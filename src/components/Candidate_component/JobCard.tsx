import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bookmark, MapPin, IndianRupee } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface JobCardProps {
  title: string;
  company: string;
  logo: any;
  location: string;
  salary: string;
  type: string;
  posted?: string;
  isSaved?: boolean;
  onPress?: () => void;
  onSave?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  title, company, logo, location, salary, type, posted, isSaved = false, onPress, onSave
}) => {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) onSave();
  };

  const hasTags = location || salary || type;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {logo ? (
            <Image source={logo} style={styles.logo} />
          ) : (
            <Text style={styles.logoPlaceholder}>{company ? company.charAt(0) : ''}</Text>
          )}
        </View>
        <View style={styles.companyBlock}>
          {!!company && <Text style={styles.company} numberOfLines={1}>{company}</Text>}
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </View>
        <Pressable onPress={handleSave} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Bookmark
            color={saved ? Colors.primary : Colors.textTertiary}
            fill={saved ? Colors.primary : 'transparent'}
            size={RFValue(13)}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      {hasTags ? (
        <View style={styles.tagsRow}>
          {!!location && (
            <View style={styles.tag}>
              <MapPin color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} />
              <Text style={styles.tagText}>{location}</Text>
            </View>
          )}
          {!!salary && (
            <View style={styles.tag}>
              {/* <IndianRupee color={Colors.textTertiary} size={RFValue(8)} strokeWidth={2} /> */}
              <Text style={styles.tagText}>{salary}</Text>
            </View>
          )}
          {!!type && (
            <View style={[styles.typeChip]}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          )}
        </View>
      ) : null}

      <View style={styles.footer}>
        {posted ? (
          <Text style={styles.timeText}>Posted {posted}</Text>
        ) : <View />}
        <Pressable style={styles.applyBtn} onPress={onPress}>
          <Text style={styles.applyText}>Apply Now</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('2%'),
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
    width: wp('9%'),
    height: wp('9%'),
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
    fontSize: RFValue(8.5),
    color: Colors.textTertiary,
    fontWeight: '500',
    marginBottom: hp('0.3%'),
  },
  title: {
    fontSize: RFValue(10.5),
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: hp('2%'),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginBottom: hp('1%'),
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
    borderTopColor: Colors.border,
    paddingTop: hp('0.8%'),
  },
  timeText: {
    fontSize: RFValue(8.5),
    color: Colors.textTertiary,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.7%'),
    borderRadius: wp('1.5%'),
  },
  applyText: {
    fontSize: RFValue(9),
    fontWeight: '700',
    color: Colors.white,
  },
});

export default JobCard;
