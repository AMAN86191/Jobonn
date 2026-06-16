import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import InviteCard from '../../components/Candidate_component/InviteCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { jobInvites } from '../../data/jobonnStaticData';

const TABS = ['Pending', 'Accepted','Shortlisted', 'Rejected'];
type InviteStatus = 'pending' | 'accepted' | 'shortlisted' | 'rejected';
type Invite = Omit<(typeof jobInvites)[number], 'status'> & { status: InviteStatus; logo?: string };

const CandidateInvitesScreen = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [invites, setInvites] = useState<Invite[]>(jobInvites as Invite[]);

  const filteredInvites = invites.filter(inv => inv.status === activeTab.toLowerCase());
  const updateInviteStatus = (id: string, status: InviteStatus) => {
    setInvites(prev => prev.map(invite => invite.id === id ? { ...invite, status } : invite));
  };

  return (

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Job Invites</Text>
            <Text style={styles.headerSubtitle}>Manage your interview requests</Text>
          </View>

          <View style={styles.tabsContainer}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {filteredInvites.length > 0 ? (
              filteredInvites.map(invite => (
                <InviteCard
                  key={invite.id}
                  {...invite}
                  onAccept={() => updateInviteStatus(invite.id, 'accepted')}
                  onReject={() => updateInviteStatus(invite.id, 'rejected')}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No {activeTab} Invites</Text>
                <Text style={styles.emptySubtitle}>You do not have any {activeTab.toLowerCase()} job invites at the moment.</Text>
              </View>
            )}

            <View style={{ height: hp('10%') }} />
          </ScrollView>
        </View>
      </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp('2%'),
    // paddingTop: hp('6%'),
    // paddingBottom: hp('2%'),
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: hp('0.5%'),
  },
  tabsContainer: {
    flexDirection: 'row',
    // paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('2%'),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('10%'),
    paddingHorizontal: wp('10%'),
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
});

export default CandidateInvitesScreen;
