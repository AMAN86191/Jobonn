import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TextInput, Pressable, ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { StatusType } from '../../components/Manager_component/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { getAppliedCandidatesSlice } from '../../redux/CompanyHomeSlice';

const TABS = ['New', 'Shortlisted', 'Invited', 'Accepted Invite', 'Interview', 'Hired', 'Rejected'];

const mapApiStatusToTab = (apiStatus: string) => {
  switch (apiStatus?.toLowerCase()) {
    case 'applied': return 'New';
    case 'shortlisted': return 'Shortlisted';
    case 'invited': return 'Invited';
    case 'accepted': return 'Accepted Invite';
    case 'interview': return 'Interview';
    case 'hired': return 'Hired';
    case 'rejected': return 'Rejected';
    default: return 'New';
  }
};

const mapTabToBadgeStatus = (tabName: string): StatusType => {
  switch (tabName) {
    case 'New': return 'New';
    case 'Shortlisted': return 'Shortlisted';
    case 'Invited': return 'Pending';
    case 'Accepted Invite': return 'Active';
    case 'Interview': return 'Interview';
    case 'Hired': return 'Hired';
    case 'Rejected': return 'Rejected';
    default: return 'Pending';
  }
};

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const cleanDateStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
    const createdDate = new Date(cleanDateStr);
    const diffMs = Math.max(0, Date.now() - createdDate.getTime());

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  } catch {
    return '';
  }
};

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
    title: 'Skills',
    type: 'searchable-multi',
    options: [
      { key: 'React Native', label: 'React Native' },
      { key: 'TypeScript', label: 'TypeScript' },
      { key: 'Node.js', label: 'Node.js' },
      { key: 'Figma', label: 'Figma' },
      { key: 'AWS', label: 'AWS' },
      { key: 'Python', label: 'Python' },
      { key: 'Redux', label: 'Redux' },
      { key: 'Kubernetes', label: 'Kubernetes' },
    ],
  },
  { title: 'Experience', type: 'range', options: [] },
  { title: 'Salary Range', type: 'range', options: [] },
  {
    title: 'Job Type',
    options: [
      { key: 'Full-Time', label: 'Full-Time' },
      { key: 'Part-Time', label: 'Part-Time' },
      { key: 'Contract', label: 'Contract' },
      { key: 'Internship', label: 'Internship' },
    ],
  },
  {
    title: 'Work Mode',
    options: [
      { key: 'Remote', label: 'Remote' },
      { key: 'Hybrid', label: 'Hybrid' },
      { key: 'On-site', label: 'On-site' },
    ],
  },
  {
    title: 'Location',
    type: 'searchable-multi',
    options: [
      { key: 'Bangalore', label: 'Bangalore' },
      { key: 'Mumbai', label: 'Mumbai' },
      { key: 'Hyderabad', label: 'Hyderabad' },
      { key: 'Delhi NCR', label: 'Delhi NCR' },
      { key: 'Pune', label: 'Pune' },
      { key: 'Remote', label: 'Remote' },
    ],
  },
  {
    title: 'Education',
    options: [
      { key: 'B.Tech', label: 'B.Tech' },
      { key: 'M.Tech', label: 'M.Tech' },
      { key: 'MCA', label: 'MCA' },
      { key: 'MBA', label: 'MBA' },
      { key: 'BSc', label: 'BSc' },
    ],
  },
  {
    title: 'Notice Period',
    type: 'minmax',
    options: [],
  },
];

const ManagerApplicantsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('New');
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const [appliedCandidates, setAppliedCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const fetchApplicants = async (pageNum: number, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const response = await dispatch(getAppliedCandidatesSlice(pageNum)).unwrap();
      console.log('getAppliedCandidates response:', response);
      const list = response?.applications?.data || [];
      setAppliedCandidates(list);
      setLastPage(response?.applications?.last_page || 1);
      setTotalCandidates(response?.applications?.total || 0);
    } catch (error) {
      console.log('Error fetching applied candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(page);
  }, [page]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchApplicants(1);
      setPage(1);
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplicants(page, true);
    setRefreshing(false);
  };

  const normalizedApplicants = useMemo(() => {
    return (appliedCandidates || []).map((item: any) => {
      const cand = item.candidate || {};
      const job = item.applied_job || {};

      const currentCTC = cand.current_ctc ? `${cand.current_ctc} LPA` : undefined;
      const expectedCTC = cand.expected_salary ? `${cand.expected_salary} LPA` : undefined;
      const mappedStatus = mapApiStatusToTab(item.status);

      return {
        id: String(item.id),
        user_id: item.user_id,
        candidate_id: cand.id,
        name: cand.name || '',
        role: cand.job_title || '',
        experience: cand.experience || 'Fresher',
        location: cand.location || '',
        status: mapTabToBadgeStatus(mappedStatus),
        atsStage: mappedStatus,
        currentCTC: currentCTC,
        expectedCTC: expectedCTC,
        time: formatTimeAgo(item.applied_at),
        image: cand.profile_img ? { uri: cand.profile_img } : undefined,
        emailAddress: cand.email || '',
        phoneNumber: cand.phone || '',
        whatsappNumber: cand.phone || '',
        noticePeriod: cand.notice_period || 'Immediate',
        preferredLocation: cand.location || '',
        jobType: job.job_type || '',
        appliedJob: job.job_title || '',
        rawApplication: item,
      };
    });
  }, [appliedCandidates]);

  const filtered = normalizedApplicants.filter((a: any) => {
    const matchTab = a.atsStage === activeTab || a.status === activeTab;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());

    // Department Filter
    const matchDept = !selected.Department?.length || selected.Department.includes(a.department);

    // Skills Filter
    const matchSkills = !selected.Skills?.length || selected.Skills.some(skill => a.skills?.includes(skill));

    // Experience Range Filter
    let matchExp = true;
    if (selected.Experience?.length === 2) {
      const minExp = parseInt(selected.Experience[0]);
      const maxExp = parseInt(selected.Experience[1]);
      const expVal = parseInt(a.experience) || 0;
      matchExp = expVal >= minExp && expVal <= maxExp;
    }

    // Salary Range Filter
    let matchSalary = true;
    if (selected['Salary Range']?.length === 2) {
      const minSal = parseInt(selected['Salary Range'][0]);
      const maxSal = parseInt(selected['Salary Range'][1]);
      const salVal = parseInt(a.currentCTC) || 0;
      matchSalary = salVal >= minSal && salVal <= maxSal;
    }

    // Job Type Filter
    const matchJobType = !selected['Job Type']?.length || selected['Job Type'].includes(a.jobType);

    // Work Mode Filter
    const matchWorkMode = !selected['Work Mode']?.length || selected['Work Mode'].includes(a.workMode);

    // Location Filter
    const matchLocation = !selected.Location?.length || selected.Location.includes(a.location);

    // Education Filter
    const matchEducation = !selected.Education?.length || selected.Education.includes(a.education);

    // Notice Period Filter
    let matchNotice = true;
    if (selected['Notice Period']?.length === 2) {
      const minN = selected['Notice Period'][0] === '' ? 0 : parseInt(selected['Notice Period'][0]);
      const maxN = selected['Notice Period'][1] === '' ? 999 : parseInt(selected['Notice Period'][1]);
      const applicantNotice = a.noticePeriod === 'Immediate' ? 0 : parseInt(a.noticePeriod) || 0;
      matchNotice = applicantNotice >= minN && applicantNotice <= maxN;
    }

    // Company Type Filter
    const matchCompany = !selected['Company Type']?.length || selected['Company Type'].includes(a.companyType);

    // Benefits Filter
    const matchBenefits = !selected.Benefits?.length || selected.Benefits.some(benefit => a.benefits?.includes(benefit));

    // Posted Date Filter
    const matchPosted = !selected['Posted Date']?.length || selected['Posted Date'].includes(a.postedDate);

    // Interview Type Filter
    const matchInterview = !selected['Interview Type']?.length || selected['Interview Type'].includes(a.interviewType);

    return matchTab && matchSearch && matchDept && matchSkills && matchExp && matchSalary && matchJobType && matchWorkMode && matchLocation && matchEducation && matchNotice && matchCompany && matchBenefits && matchPosted && matchInterview;
  });

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
  console.log('filtered', filtered)
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <MainManagerHeader
        title="Applicants"
        subtitle={`${totalCandidates || 0} total candidates`}
      />

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color={Colors.textTertiary} size={RFValue(11)} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or role..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <SlidersHorizontal color={Colors.white} size={RFValue(11)} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab: string) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.countText}>{filtered.length} candidate{filtered.length !== 1 ? 's' : ''}</Text>

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {loading && normalizedApplicants.length === 0 ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('3%') }} />
        ) : filtered.length > 0 ? (
          <>
            {filtered.map((applicant: any) => (
              <CandidateCard
                key={applicant.id}
                {...applicant}
                avatarColor={getAvatarColor(applicant.name)}
                onPress={() => navigation.navigate('CandidateApplicationFullView', { applicant })}
              />
            ))}

            {/* Pagination Controls */}
            {lastPage > 1 && (
              <View style={styles.paginationRow}>
                <TouchableOpacity
                  style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                  disabled={page === 1}
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ArrowLeft size={RFValue(11)} color={page === 1 ? Colors.textTertiary : Colors.primary} />
                  <Text style={[styles.pageBtnText, page === 1 && styles.pageBtnTextDisabled]}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfoText}>
                  Page {page} of {lastPage}
                </Text>

                <TouchableOpacity
                  style={[styles.pageBtn, page === lastPage && styles.pageBtnDisabled]}
                  disabled={page === lastPage}
                  onPress={() => setPage(p => Math.min(lastPage, p + 1))}
                >
                  <Text style={[styles.pageBtnText, page === lastPage && styles.pageBtnTextDisabled]}>Next</Text>
                  <ArrowRight size={RFValue(11)} color={page === lastPage ? Colors.textTertiary : Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No candidate found</Text>
            <Text style={styles.emptyStateSubText}>Try adjusting your search or filters</Text>
          </View>
        )}
        <View style={{ height: hp('12%') }} />
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
  searchRow: { flexDirection: 'row', paddingHorizontal: wp('2%'), gap: wp('2.5%'), marginBottom: hp('1.2%'), marginTop: hp('1.2%') },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp('2.5%'),
    paddingHorizontal: wp('3%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('2%'),
  },
  searchInput: { flex: 1, fontSize: RFValue(10), color: Colors.textPrimary },
  filterBtn: {
    width: hp('4%'),
    height: hp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    paddingLeft: wp('4%'),
    height: 50,
    flexGrow: 0,
  },
  tabsContent: {
    flexDirection: 'row',
    gap: wp('2.5%'),
    paddingRight: wp('4%'),
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: wp('4%'),
    height: 36,
    minWidth: 70,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: RFValue(9.5), color: Colors.textSecondary, fontWeight: '600', includeFontPadding: false },
  tabTextActive: { color: Colors.white },
  countText: { fontSize: RFValue(8.5), color: Colors.textTertiary, paddingHorizontal: wp('4%'), marginBottom: hp('0.8%') },
  listScroll: {
    flex: 1,
  },
  list: { paddingHorizontal: wp('2') },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('8%'),
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: hp('2%'),
    marginHorizontal: wp('2%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: RFValue(11),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  emptyStateSubText: {
    fontSize: RFValue(8.5),
    color: Colors.textTertiary,
    marginTop: hp('0.5%'),
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  pageBtnDisabled: {
    borderColor: Colors.border,
  },
  pageBtnText: {
    fontSize: RFValue(9),
    color: Colors.primary,
    fontWeight: '700',
  },
  pageBtnTextDisabled: {
    color: Colors.textTertiary,
  },
  pageInfoText: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default ManagerApplicantsScreen;
