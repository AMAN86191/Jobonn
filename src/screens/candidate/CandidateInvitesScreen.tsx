import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import InviteCard from '../../components/Candidate_component/InviteCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { fetchCandidateInvitationsSlice, replyCandidateInvitationSlice } from '../../redux/CandidateJobSlice';
import Toast from 'react-native-toast-message';

const TABS = ['Pending', 'Accepted', 'Rejected'];

const CandidateInvitesScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Pending');
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const res = await dispatch(fetchCandidateInvitationsSlice() as any).unwrap();
      console.log('fetchCandidateInvitations API response:', res);
      const rawInvites = res?.invitations?.data || res?.data || (Array.isArray(res) ? res : []);
      const normalized = rawInvites.map((invite: any) => {
        const apiStatus = (invite.status || '').toLowerCase();
        let mappedStatus: 'pending' | 'accepted' | 'shortlisted' | 'rejected' = 'pending';
        if (apiStatus === 'accepted' || apiStatus === 'accept') {
          mappedStatus = 'accepted';
        } else if (apiStatus === 'shortlisted' || apiStatus === 'shortlist') {
          mappedStatus = 'shortlisted';
        } else if (apiStatus === 'rejected' || apiStatus === 'rejected_by_candidate' || apiStatus === 'rejected_by_company' || apiStatus === 'rejected') {
          mappedStatus = 'rejected';
        } else {
          mappedStatus = 'pending'; // 'sent' maps to 'pending'
        }

        const rawLogo = invite.job?.company?.company_logo || invite.job?.company_profile?.logo || invite.job?.logo || '';
        const logoUrl = rawLogo
          ? (rawLogo.startsWith('http') ? rawLogo : `https://admin.jobonn.in/storage/${rawLogo}`)
          : undefined;

        const location = invite.job?.locations && Array.isArray(invite.job.locations) && invite.job.locations.length > 0
          ? invite.job.locations.join(', ')
          : (invite.job?.company?.office_location || invite.job?.location || 'Remote');

        return {
          id: String(invite.id),
          jobId: invite.job_id,
          company: invite.job?.company?.company_name || invite.job?.company_profile?.company_name || 'Company',
          role: invite.job?.job_title?.job_name || invite.job?.job_title || invite.job?.title || 'Job Post',
          location,
          logo: logoUrl,
          status: mappedStatus,
          message: invite.message || '',
          rawInvite: invite,
        };
      }).filter(Boolean);
      setInvites(normalized);
    } catch (e) {
      console.log('Error fetching candidate invitations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
    const unsubscribe = navigation?.addListener('focus', () => {
      fetchInvitations();
    });
    return unsubscribe;
  }, [navigation]);

  const handleReplyInvite = async (inviteId: string, id: string | number, status: 'accepted' | 'rejected') => {
    try {
      const result = await dispatch(
        replyCandidateInvitationSlice({ invitationId: id, status }) as any
      ).unwrap();
      console.log('Reply invite response:', result);

      const apiRes = result?.response || result;

      if (
        apiRes &&
        (apiRes.status === true ||
          apiRes.status_code === 200 ||
          apiRes.status_code === '200' ||
          apiRes.status === 'success')
      ) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: apiRes.message || `Invitation ${status === 'accepted' ? 'accepted' : 'declined'} successfully!`,
        });
        fetchInvitations();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: apiRes?.message || 'Failed to update invitation status',
        });
      }
    } catch (error: any) {
      console.log('Error replying to invitation:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to update invitation status',
      });
    }
  };

  const filteredInvites = invites.filter(inv => inv.status === activeTab.toLowerCase());

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
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('5%') }} />
            ) : filteredInvites.length > 0 ? (
              filteredInvites.map(invite => (
                <InviteCard
                  key={invite.id}
                  {...invite}
                  onAccept={() => handleReplyInvite(invite.id, invite.id, 'accepted')}
                  onReject={() => handleReplyInvite(invite.id, invite.id, 'rejected')}
                  onPress={() => navigation.navigate('JobDetails', { 
                    job: invite.rawInvite?.job || invite.rawInvite,
                    invite: {
                      id: invite.id,
                      status: invite.status
                    }
                  })}
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
