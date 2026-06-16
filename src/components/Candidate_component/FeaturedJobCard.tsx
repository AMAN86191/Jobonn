import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bookmark, MapPin } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface FeaturedJobCardProps {
  company: string;
  role: string;
  location: string;
  salary: string;
  logo: string;
  bg: string;
}

const FeaturedJobCard: React.FC<FeaturedJobCardProps> = ({ company, role, location, salary, logo, bg }) => (
  <TouchableOpacity style={[styles.featuredCard, { backgroundColor: bg }]}>
    <View style={styles.featuredHeader}>
      <View style={styles.companyLogo}>
        <Text style={styles.logoText}>{logo}</Text>
      </View>
      <TouchableOpacity>
        <Bookmark color={Colors.white} size={wp('5%')} />
      </TouchableOpacity>
    </View>
    <Text style={styles.featuredRole}>{role}</Text>
    <Text style={styles.featuredCompany}>{company}</Text>
    <View style={styles.featuredFooter}>
      <View style={styles.footerInfo}>
        <MapPin color={Colors.white} size={wp('4%')} />
        <Text style={styles.footerText}>{location}</Text>
      </View>
      <Text style={styles.featuredSalary}>{salary}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  featuredCard: {
    width: wp('70%'), padding: wp('5%'), borderRadius: wp('6%'),
    marginRight: wp('4%'),
  },
  featuredHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('2%') },
  companyLogo: {
    width: wp('10%'), height: wp('10%'), borderRadius: wp('2.5%'),
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  logoText: { color: Colors.white, fontWeight: '800', fontSize: wp('5%') },
  featuredRole: { ...Typography.h3, color: Colors.white, marginBottom: hp('0.5%') },
  featuredCompany: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)', marginBottom: hp('2.5%') },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerInfo: { flexDirection: 'row', alignItems: 'center' },
  footerText: { ...Typography.caption, color: Colors.white, marginLeft: wp('1%') },
  featuredSalary: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
});

export default FeaturedJobCard;
