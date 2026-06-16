import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Activity, Clock, Filter, User } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import { auditLogs } from '../../data/jobonnStaticData';

const TABS = ['All', 'Jobs', 'Candidates', 'Interviews', 'Credits'];

const AuditLogScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Jobs') return log.action.includes('Job');
    if (activeTab === 'Candidates') return log.action.includes('Candidate');
    if (activeTab === 'Interviews') return log.action.includes('Interview');
    if (activeTab === 'Credits') return log.action.includes('Contact') || log.action.includes('Package');
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <CommanManagerHeader title="Audit Logs" navigation={navigation} onBack={() => navigation.goBack()} />

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Activity size={RFValue(14)} color={Colors.primary} />
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle}>Every recruitment action is tracked</Text>
          <Text style={styles.summarySub}>Job edits, candidate movement, interview scheduling, contact unlocks and package activity.</Text>
        </View>
      </View>

      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Filter size={RFValue(8)} color={activeTab === tab ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filteredLogs.map(log => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logIcon}>
              <User size={RFValue(10)} color={Colors.primary} />
            </View>
            <View style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logAction}>{log.action}</Text>
                <View style={styles.timeRow}>
                  <Clock size={RFValue(7.5)} color={Colors.textTertiary} />
                  <Text style={styles.logTime}>{log.timestamp}</Text>
                </View>
              </View>
              <Text style={styles.logEntity}>{log.entity}</Text>
              <Text style={styles.logUser}>By {log.user}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  summaryCard: {
    marginHorizontal: wp('4%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    flexDirection: 'row',
    gap: wp('3%'),
    marginBottom: hp('1%'),
  },
  summaryIcon: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCopy: { flex: 1 },
  summaryTitle: { fontSize: RFValue(10), color: Colors.textPrimary, fontWeight: '800' },
  summarySub: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '600',
    lineHeight: RFValue(11.5),
    marginTop: hp('0.3%'),
  },
  tabsWrapper: { paddingLeft: wp('4%'), marginBottom: hp('1%') },
  tabsContent: { gap: wp('2%'), paddingRight: wp('4%') },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.7%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: RFValue(8.5), color: Colors.textSecondary, fontWeight: '700' },
  tabTextActive: { color: Colors.white },
  list: { paddingHorizontal: wp('4%'), paddingBottom: hp('4%') },
  logCard: {
    flexDirection: 'row',
    gap: wp('3%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginBottom: hp('1%'),
  },
  logIcon: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logContent: { flex: 1 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: wp('2%') },
  logAction: { flex: 1, fontSize: RFValue(9.2), color: Colors.textPrimary, fontWeight: '800' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: wp('1%') },
  logTime: { fontSize: RFValue(6.8), color: Colors.textTertiary, fontWeight: '700' },
  logEntity: { fontSize: RFValue(8.2), color: Colors.textSecondary, fontWeight: '700', marginTop: hp('0.4%') },
  logUser: { fontSize: RFValue(7.5), color: Colors.primary, fontWeight: '700', marginTop: hp('0.4%') },
});

export default AuditLogScreen;
