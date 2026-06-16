import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, Pressable, TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Check } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import NotificationCard from '../../components/Manager_component/NotificationCard';
import { RFValue } from 'react-native-responsive-fontsize';
import { employerNotifications } from '../../data/jobonnStaticData';

const NOTIFICATIONS = employerNotifications;

const FILTER_TABS = ['All', 'Unread', 'Applications', 'Interviews'];

const ManagerNotificationsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filtered = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.read;
    if (activeTab === 'Applications') return n.type === 'application';
    if (activeTab === 'Interviews') return n.type === 'interview';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <Animated.View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={Colors.textPrimary} size={RFValue(14)} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Check color={Colors.primary} size={wp('4%')} />
            <Text style={styles.markAllText}>All read</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <Animated.View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_TABS.map(tab => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {filtered.length === 0 ? (
        <Animated.View style={styles.emptyState}>
          <Bell color={Colors.border} size={wp('14%')} />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </Animated.View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {filtered.map((notif) => (
            <Animated.View
              key={notif.id}

            >
              <NotificationCard
                {...notif}
                onPress={() => markRead(notif.id)}
                onDelete={() => deleteNotification(notif.id)}
              />
            </Animated.View>
          ))}
          <View style={{ height: hp('12%') }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.5%'),
  },
  backBtn: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: wp('3%') },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary, fontWeight: '800' },
  unreadBadge: {
    backgroundColor: Colors.danger,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.2%'),
    marginLeft: wp('2%'),
  },
  unreadBadgeText: { color: Colors.white, fontSize: wp('3%'), fontWeight: '700' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: wp('1%') },
  markAllText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  tabsRow: { paddingHorizontal: wp('4%'), marginBottom: hp('1%') },
  tab: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    marginRight: wp('2%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.white },
  list: { paddingHorizontal: wp('4%') },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp('1%'),
  },
  emptyTitle: { ...Typography.h3, color: Colors.textSecondary, marginTop: hp('2%') },
  emptySubtitle: { ...Typography.caption, color: Colors.textSecondary },
});

export default ManagerNotificationsScreen;
