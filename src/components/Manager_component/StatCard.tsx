import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon color={color} size={RFValue(11)} strokeWidth={2} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={[styles.accentBar, { backgroundColor: color }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
    marginHorizontal: wp('0.8%'),
    overflow: 'hidden',
  },
  iconBox: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.6%'),
  },
  value: {
    fontSize: RFValue(13),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.1%'),
  },
  title: { fontSize: RFValue(8.5), color: Colors.textSecondary, fontWeight: '500' },
  subtitle: { fontSize: RFValue(7.5), color: Colors.textTertiary, marginTop: hp('0.2%') },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});

export default StatCard;
