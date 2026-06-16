import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';

interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, trend, icon: Icon, color, subtitle }) => {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? Colors.success : trend < 0 ? Colors.danger : Colors.textSecondary;
  const trendLabel = trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : 'Stable';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <Icon color={color} size={RFValue(11)} strokeWidth={2} />
        </View>
        <View style={[styles.trendBadge, { backgroundColor: trendColor + '15' }]}>
          <TrendIcon color={trendColor} size={RFValue(7.5)} strokeWidth={2.5} />
          <Text style={[styles.trendText, { color: trendColor }]}>{trendLabel}</Text>
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    width: wp('45%'),
    marginBottom: hp('1.2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  iconBox: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.25%'),
    borderRadius: wp('3%'),
    gap: wp('0.5%'),
  },
  trendText: { fontSize: RFValue(7.5), fontWeight: '700' },
  value: { fontSize: RFValue(16), fontWeight: '800', color: Colors.textPrimary, marginBottom: hp('0.15%') },
  title: { fontSize: RFValue(8.5), color: Colors.textSecondary, fontWeight: '500' },
  subtitle: { fontSize: RFValue(7.5), color: Colors.textTertiary, marginTop: hp('0.2%') },
});

export default AnalyticsCard;
