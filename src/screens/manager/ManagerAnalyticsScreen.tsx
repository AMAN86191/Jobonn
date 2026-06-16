import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import AnalyticsCard from '../../components/Manager_component/AnalyticsCard';
import ChartCard from '../../components/Manager_component/ChartCard';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import { analyticsReports, revenueStreams } from '../../data/jobonnStaticData';

const PERIOD_TABS = ['7 Days', '30 Days', '3 Months'];

const WEEKLY_APPLICATIONS = analyticsReports.weeklyApplications;

const HIRED_TREND = analyticsReports.hiredTrend;

const ManagerAnalyticsScreen = () => {
  const [period, setPeriod] = useState('7 Days');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      
      <MainManagerHeader 
        title="Analytics" 
        subtitle="Performance overview" 
        rightComponent={
          <View style={styles.periodTabs}>
            {PERIOD_TABS.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodTab, period === p && styles.periodTabActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        } 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <View style={styles.metricsGrid}>
          <AnalyticsCard title="Total Applicants" value="248" trend={12} icon={Users} color={Colors.primary} />
          <AnalyticsCard title="Active Jobs" value="12" trend={2} icon={Briefcase} color={Colors.info} />
          <AnalyticsCard title="Interviews" value="18" trend={-5} icon={Calendar} color={Colors.warning} />
          <AnalyticsCard title="Hired This Month" value="3" trend={50} icon={TrendingUp} color={Colors.success} subtitle="vs last month" />
        </View>

        <ChartCard
          title="Applications This Week"
          subtitle="Daily application volume"
          data={WEEKLY_APPLICATIONS}
          type="bar"
          color={Colors.primary}
        />

        <ChartCard
          title="Hiring Trend"
          subtitle="Weekly hires over the month"
          data={HIRED_TREND}
          type="line"
          color={Colors.success}
        />

        <View style={styles.reportBand}>
          <Text style={styles.reportTitle}>Revenue Model</Text>
          {revenueStreams.map(stream => (
            <View key={stream.id} style={styles.revenueRow}>
              <View>
                <Text style={styles.revenueTitle}>{stream.title}</Text>
                <Text style={styles.revenueSub}>{stream.subtitle}</Text>
              </View>
              <Text style={styles.revenueValue}>{stream.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: hp('12%') }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: wp('4%'), paddingTop: hp('1.5%') },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    padding: wp('0.8%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodTab: { paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.5%'), borderRadius: wp('1.5%') },
  periodTabActive: { backgroundColor: Colors.primary },
  periodTabText: { fontSize: RFValue(8.5), color: Colors.textSecondary, fontWeight: '600' },
  periodTabTextActive: { color: Colors.white },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  reportBand: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginTop: hp('1%'),
  },
  reportTitle: {
    fontSize: RFValue(10),
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: hp('1%'),
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.9%'),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  revenueTitle: {
    fontSize: RFValue(8.8),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  revenueSub: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.2%'),
  },
  revenueValue: {
    fontSize: RFValue(9),
    color: Colors.primary,
    fontWeight: '800',
  },
});

export default ManagerAnalyticsScreen;
