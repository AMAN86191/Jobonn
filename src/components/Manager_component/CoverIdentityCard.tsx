import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Award, Building2, Globe, MapPin, Users, ExternalLink, BadgeCheck } from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface CoverIdentityCardProps {
  coverImage: string | null;
  companyLogo: string | null;
  companyName: string;
  userName: string;
  location?: string;
  industry?: string;
  companySize?: string;
  website?: string;
}

export const CoverIdentityCard: React.FC<CoverIdentityCardProps> = React.memo(({
  coverImage,
  companyLogo,
  companyName,
  userName,
  location,
  industry,
  companySize,
  website,
}) => {
  const handleWebsitePress = () => {
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    }
  };

  const getAvatarInitials = () => {
    if (companyName) {
      return companyName.charAt(0).toUpperCase();
    }
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return 'C';
  };

  const displayName = companyName || userName || 'Profile Name Not Set';

  return (
    <RAnimated.View entering={FadeInDown.duration(400)} style={styles.identityCard}>
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.coverBanner} />
      ) : (
        <View style={[styles.coverBanner, { backgroundColor: Colors.primary + '15' }]} />
      )}
      <View style={styles.identityMain}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            {companyLogo ? (
              <Image source={{ uri: companyLogo }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{getAvatarInitials()}</Text>
            )}
          </View>
          <View style={styles.verifiedBadge}>
            <BadgeCheck size={RFValue(15)} strokeWidth={2} color={Colors.white} fill={Colors.primary} />
          </View>
        </View>

        <View style={styles.companyTitleContainer}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Award color={Colors.primary} size={RFValue(11)} />
        </View>

        {!!location && (
          <View style={styles.companyLocationRow}>
            <MapPin color={Colors.textSecondary} size={RFValue(9.5)} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        )}

        {/* Badges strip */}
        {(!!industry || !!companySize) && (
          <View style={styles.badgesStrip}>
            {!!industry && (
              <View style={styles.stripBadge}>
                <Building2 size={RFValue(9)} color={Colors.textSecondary} />
                <Text style={styles.stripBadgeText}>{industry}</Text>
              </View>
            )}

            {!!companySize && (
              <View style={styles.stripBadge}>
                <Users size={RFValue(9)} color={Colors.textSecondary} />
                <Text style={styles.stripBadgeText}>{companySize}</Text>
              </View>
            )}
          </View>
        )}

        {/* Website Link */}
        {!!website && (
          <TouchableOpacity style={styles.webLinkRow} onPress={handleWebsitePress}>
            <Globe size={RFValue(9.5)} color={Colors.primary} />
            <Text style={styles.webLinkText}>www.{website}</Text>
            <ExternalLink size={RFValue(8.5)} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </RAnimated.View>
  );
});

const styles = StyleSheet.create({
  identityCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: hp('1.2%'),
  },
  coverBanner: {
    height: hp('15%'),
    width: '100%',
    resizeMode: 'cover',
  },
  identityMain: {
    alignItems: 'center',
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  avatarWrapper: {
    marginTop: -wp('7%'),
    position: 'relative',
    marginBottom: hp('0.8%'),
  },
  avatar: {
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: wp('16%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
      borderRadius: wp('16%'),
  },
  avatarText: {
    color: Colors.white,
    fontSize: RFValue(20),
    fontWeight: '800',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -wp('0.5%'),
    right: -wp('0.5%'),
    // backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('0.4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('0.2%'),
  },
  profileName: {
    fontSize: RFValue(12),
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  companyLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginBottom: hp('0.8%'),
  },
  locationText: {
    fontSize: RFValue(8.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  badgesStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginBottom: hp('0.8%'),
  },
  stripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    backgroundColor: '#F3F4F6',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 6,
  },
  stripBadgeText: {
    fontSize: RFValue(7.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  webLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    // marginTop: hp('0.3%'),
  },
  webLinkText: {
    fontSize: RFValue(8.8),
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default CoverIdentityCard;
