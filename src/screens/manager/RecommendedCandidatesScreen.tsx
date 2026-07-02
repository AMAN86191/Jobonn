import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { useDispatch } from 'react-redux';
import { getRecommendedCandidatesSlice, getAllInvitationsSlice } from '../../redux/CompanyHomeSlice';

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Department',
    type: 'searchable-multi',
    options: [
      { key: 'Engineering', label: 'Engineering' },
      { key: 'Design', label: 'Design' },
      { key: 'Product', label: 'Product' },
      { key: 'Marketing', label: 'Marketing' },
      { key: 'Sales', label: 'Sales' },
    ],
  },
  {
    title: 'Location',
    type: 'searchable-multi',
    options: [
      { key: 'Bangalore', label: 'Bangalore' },
      { key: 'Mumbai', label: 'Mumbai' },
      { key: 'Hyderabad', label: 'Hyderabad' },
      { key: 'Remote', label: 'Remote' },
    ],
  },
];

const TABS = ['Recommended', 'Invited', 'Accepted', 'Rejected'];

const normalizeRecommendedCandidate = (cand: any) => {
  if (!cand) return null;

  // Extract name and email
  const name = cand.name || cand.user?.name || '';
  const email = cand.email || cand.user?.email || '';

  // Extract professional details
  const role = cand.professional_detail?.job_title || cand.job_title || cand.role || '';
  const experience = cand.professional_detail?.experience || cand.experience || 'Fresher';

  // Extract location
  let location = cand.location || '';
  if (!location && cand.personal_detail) {
    const city = cand.personal_detail.city || '';
    const state = cand.personal_detail.state || '';
    if (city && state) {
      location = `${city}, ${state}`;
    } else {
      location = city || state || '';
    }
  }

  // Extract CTC
  const rawCurrentCTC = cand.professional_detail?.current_ctc || cand.current_ctc;
  const currentCTC = rawCurrentCTC ? `${rawCurrentCTC} LPA` : undefined;

  const rawExpectedCTC = cand.professional_detail?.expected_salary || cand.expected_salary;
  const expectedCTC = rawExpectedCTC ? `${rawExpectedCTC} LPA` : undefined;

  // Extract Image
  const profileImg = cand.profile_img || cand.docs?.profile_img || cand.image;

  // Extract notice period
  const noticePeriod = cand.professional_detail?.notice_period || cand.notice_period || 'Immediate';

  return {
    id: String(cand.id),
    user_id: cand.user_id,
    candidate_id: cand.id,
    name,
    role,
    experience,
    location,
    status: undefined,
    currentCTC,
    expectedCTC,
    image: profileImg ? { uri: profileImg.startsWith('http') ? profileImg : `https://admin.jobonn.in/storage/${profileImg}` } : undefined,
    emailAddress: email,
    phoneNumber: cand.phone || '',
    whatsappNumber: cand.phone || '',
    noticePeriod,
    preferredLocation: location,
    rawCandidate: cand,
  };
};

const RecommendedCandidatesScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Recommended');
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [candidates, setCandidates] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const recommendedRes = await dispatch(getRecommendedCandidatesSlice() as any).unwrap();
      console.log('getRecommendedCandidates API response:', recommendedRes);
      const rawList = recommendedRes?.data || recommendedRes?.candidates || (Array.isArray(recommendedRes) ? recommendedRes : []);
      const normalized = rawList.map((c: any) => normalizeRecommendedCandidate(c)).filter(Boolean);
      setCandidates(normalized);

      const invitationsRes = await dispatch(getAllInvitationsSlice() as any).unwrap();
      console.log('getAllInvitations API response:', invitationsRes);
      const rawInvites = invitationsRes?.invitations?.data || invitationsRes?.data || [];
      const normalizedInvites = rawInvites.map((invite: any) => {
        const cand = invite.candidate || invite.candidate_profile || invite;
        if (!cand) return null;
        const normalized = normalizeRecommendedCandidate(cand);
        if (!normalized) return null;
        return {
          ...normalized,
          status: invite.status,
          appliedJob: invite.job?.job_title?.job_name || invite.job?.job_title || invite.job?.title,
          invitationId: invite.id,
        };
      }).filter(Boolean);
      setInvitations(normalizedInvites);
    } catch (e) {
      console.log('Error fetching recommended candidates and invitations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleFilterSelect = (section: string, key: string) => {
    setSelected(prev => {
      const current = prev[section] || [];
      if (key.startsWith('range:')) {
        const [min, max] = key.replace('range:', '').split('-');
        return { ...prev, [section]: [min, max] };
      }
      if (key.startsWith('min:')) return { ...prev, [section]: [key.replace('min:', ''), current[1] || ''] };
      if (key.startsWith('max:')) return { ...prev, [section]: [current[0] || '', key.replace('max:', '')] };
      const updated = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
      return { ...prev, [section]: updated };
    });
  };

  const filtered = (activeTab === 'Recommended' ? candidates : invitations).filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(c.skills) && c.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase())));

    const matchLocation = !selected.Location?.length || selected.Location.includes(c.location);

    if (activeTab !== 'Recommended') {
      const targetStatus = activeTab.toLowerCase();
      const cStatus = (c.status || '').toLowerCase();
      
      // Map API invitation status "sent" to the "Invited" tab
      if (targetStatus === 'invited') {
        if (cStatus !== 'sent' && cStatus !== 'invited') {
          return false;
        }
      } else {
        if (cStatus !== targetStatus) {
          return false;
        }
      }
    }

    return matchSearch && matchLocation;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <CommanManagerHeader
        navigation={navigation}
        title="Invite Candidates"
      />

      {/* Search Bar & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search color={Colors.textSecondary} size={RFValue(11)} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, role, or skills..."
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, Object.values(selected).some(v => v.length > 0) && styles.filterBtnActive]}
            onPress={() => setFilterVisible(true)}
          >
            <SlidersHorizontal
              color={Object.values(selected).some(v => v.length > 0) ? Colors.white : Colors.textPrimary}
              size={RFValue(11)}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('5%') }} />
        ) : filtered.length > 0 ? (
          filtered.map((candidate, index) => (
            <Animated.View
              key={`${candidate.id}-${index}`}
              entering={FadeInDown.delay(index * 50).duration(400)}
            >
              <CandidateCard
                {...candidate}
                avatarColor={getAvatarColor(candidate.name)}
                onPress={() => navigation.navigate('CandidateApplicationFullView', { 
                  applicant: candidate, 
                  isRecommended: activeTab === 'Recommended' 
                })}
              />
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No candidates found</Text>
          </View>
        )}
        <View style={{ height: hp('8%') }} />
      </ScrollView>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        sections={FILTER_SECTIONS}
        selected={selected}
        onSelect={handleFilterSelect}
        onApply={() => setFilterVisible(false)}
        onReset={() => setSelected({})}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { paddingHorizontal: wp('2%'), marginVertical: hp('1%') },
  searchRow: { flexDirection: 'row', gap: wp('2.5%'), alignItems: 'center' },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3.5%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('2%'),
  },
  searchInput: { flex: 1, fontSize: RFValue(10), color: Colors.textPrimary, padding: 0 },
  filterBtn: {
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  list: { paddingHorizontal: wp('2%') },
  emptyState: { alignItems: 'center', marginTop: hp('10%') },
  emptyText: { fontSize: RFValue(11), color: Colors.textSecondary, fontWeight: '600' },
  tabsRow: { marginBottom: hp('1%'), borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabsContent: { paddingHorizontal: wp('3%'), gap: wp('5%'), flexDirection: 'row' },
  tab: { paddingVertical: hp('0.8%'), position: 'relative' },
  tabActive: {},
  tabText: { fontSize: RFValue(9), fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default RecommendedCandidatesScreen;
