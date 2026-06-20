import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Building2, Users, FileText, Calendar, MapPin } from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface CompanyInfoCardProps {
  industry?: string;
  companySize?: string;
  gstNumber?: string;
  foundedIn?: string;
  headquarters?: string;
  fbLink?: string | null;
  instaLink?: string | null;
  linkedLink?: string | null;
}

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = React.memo(({
  industry,
  companySize,
  gstNumber,
  foundedIn,
  headquarters,
  fbLink,
  instaLink,
  linkedLink,
}) => {
  const infoCells = [];

  if (industry) {
    infoCells.push(
      <View key="industry" style={styles.infoGridCell}>
        <View style={styles.infoGridIconBg}>
          <Building2 size={RFValue(9.5)} color={Colors.primary} />
        </View>
        <View style={styles.cellTextWrapper}>
          <Text style={styles.infoGridLabel}>Industry</Text>
          <Text style={styles.infoGridVal}>{industry}</Text>
        </View>
      </View>
    );
  }

  if (companySize) {
    infoCells.push(
      <View key="companySize" style={styles.infoGridCell}>
        <View style={styles.infoGridIconBg}>
          <Users size={RFValue(9.5)} color={Colors.primary} />
        </View>
        <View style={styles.cellTextWrapper}>
          <Text style={styles.infoGridLabel}>Company Size</Text>
          <Text style={styles.infoGridVal}>{companySize}</Text>
        </View>
      </View>
    );
  }

  if (gstNumber) {
    infoCells.push(
      <View key="gst" style={styles.infoGridCell}>
        <View style={styles.infoGridIconBg}>
          <FileText size={RFValue(9.5)} color={Colors.primary} />
        </View>
        <View style={styles.cellTextWrapper}>
          <Text style={styles.infoGridLabel}>GST Number</Text>
          <Text style={styles.infoGridVal}>{gstNumber}</Text>
        </View>
      </View>
    );
  }

  if (foundedIn) {
    infoCells.push(
      <View key="founded" style={styles.infoGridCell}>
        <View style={styles.infoGridIconBg}>
          <Calendar size={RFValue(9.5)} color={Colors.primary} />
        </View>
        <View style={styles.cellTextWrapper}>
          <Text style={styles.infoGridLabel}>Founded In</Text>
          <Text style={styles.infoGridVal}>{foundedIn}</Text>
        </View>
      </View>
    );
  }

  if (headquarters) {
    infoCells.push(
      <View key="hq" style={styles.infoGridCell}>
        <View style={styles.infoGridIconBg}>
          <MapPin size={RFValue(9.5)} color={Colors.primary} />
        </View>
        <View style={styles.cellTextWrapper}>
          <Text style={styles.infoGridLabel}>Office Location</Text>
          <Text style={styles.infoGridVal}>{headquarters}</Text>
        </View>
      </View>
    );
  }

  // If no details exist, don't show the card
  if (infoCells.length === 0) return null;

  const infoRows = [];
  for (let i = 0; i < infoCells.length; i += 2) {
    infoRows.push(
      <View key={i} style={styles.infoGridRow}>
        {infoCells[i]}
        {infoCells[i + 1] ? infoCells[i + 1] : <View style={styles.infoGridCellPlaceholder} />}
      </View>
    );
  }

  const handleSocialPress = (url: string) => {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(targetUrl).catch((err) => console.error('Failed to open URL:', err));
  };

  const socialLinks = [];
  if (linkedLink) {
    socialLinks.push(
      <TouchableOpacity
        key="linkedin"
        style={styles.socialIconBadge}
        onPress={() => handleSocialPress(linkedLink)}
      >
        <Image
          source={require('../../../assets/images/linkedin.png')}
          style={styles.socialImg}
        />
      </TouchableOpacity>
    );
  }

  if (fbLink) {
    socialLinks.push(
      <TouchableOpacity
        key="facebook"
        style={styles.socialIconBadge}
        onPress={() => handleSocialPress(fbLink)}
      >
        <Image
          source={require('../../../assets/images/google.png')}
          style={styles.socialImg}
        />
      </TouchableOpacity>
    );
  }

  if (instaLink) {
    socialLinks.push(
      <TouchableOpacity
        key="instagram"
        style={styles.socialIconBadge}
        onPress={() => handleSocialPress(instaLink)}
      >
        <Image
          source={require('../../../assets/images/insta.png')}
          style={styles.socialImg}
        />
      </TouchableOpacity>
    );
  }

  return (
    <RAnimated.View entering={FadeInDown.duration(400).delay(250)} style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Building2 color={Colors.primary} size={RFValue(11)} />
          <Text style={styles.sectionCardTitle}>Company Information</Text>
        </View>
      </View>

      <View style={styles.infoGridContainer}>
        {infoRows}
      </View>

      {socialLinks.length > 0 && (
        <>
          <View style={styles.dividerLight} />
          <View style={styles.socialRow}>
            <Text style={styles.socialLabel}>Social Links</Text>
            <View style={styles.socialIconsRow}>
              {socialLinks}
            </View>
          </View>
        </>
      )}
    </RAnimated.View>
  );
});

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('2%'),
    marginBottom: hp('1%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  sectionCardTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  infoGridContainer: {
    marginTop: hp('0.5%'),
  },
  infoGridRow: {
    flexDirection: 'row',
    marginBottom: hp('1.2%'),
  },
  infoGridCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  infoGridCellPlaceholder: {
    flex: 1,
  },
  cellTextWrapper: {
    flex: 1,
  },
  infoGridIconBg: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: 8,
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoGridLabel: {
    fontSize: RFValue(6.8),
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoGridVal: {
    fontSize: RFValue(8.2),
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: hp('0.1%'),
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: hp('1.2%'),
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('0.5%'),
  },
  socialLabel: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  socialIconBadge: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialImg: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
  },
});

export default CompanyInfoCard;
