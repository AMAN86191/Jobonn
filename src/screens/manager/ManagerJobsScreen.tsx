import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Pressable, ActivityIndicator, RefreshControl,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, SlidersHorizontal, Plus, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import ActiveJobCard from '../../components/Manager_component/ActiveJobCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';

import { getCompanyJobs, getCompanyProfile } from '../../api/CompanyHomeProvider';
import { normalizeBackendJob } from '../../utils/jobNormalizer';
import Toast from 'react-native-toast-message';
import { getProfileCompleteness } from '../../utils/profileCompleteness';

const TABS = ['Active', 'Closed', 'Draft', 'Expired'];

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Department',
    options: [
      { key: 'Engineering', label: 'Engineering' },
      { key: 'Design', label: 'Design' },
      { key: 'Product', label: 'Product' },
      { key: 'Quality', label: 'Quality' },
    ],
  },
  { title: 'Experience', type: 'range', options: [] },
  { title: 'CTC Range', type: 'range', options: [] },
  {
    title: 'Location',
    options: [
      { key: 'Bangalore', label: 'Bangalore' },
      { key: 'Mumbai', label: 'Mumbai' },
      { key: 'Hyderabad', label: 'Hyderabad' },
      { key: 'Remote', label: 'Remote' },
    ],
  },
];

const ManagerJobsScreen = ({ navigation }: any) => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('Active');
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [refreshing, setRefreshing] = useState(false);

  const [rawJobs, setRawJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [companyProfile, setCompanyProfile] = useState<any>(null);

  const fetchJobs = async (pageNum: number, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const res = await getCompanyJobs(pageNum);
      console.log('getCompanyJobs response:', res);
      const list = res?.jobs?.data || [];
      setRawJobs(list);
      setLastPage(res?.jobs?.last_page || 1);
      setTotalJobs(res?.jobs?.total || 0);
    } catch (error) {
      console.log('Error fetching company jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      const res = await getCompanyProfile();
      console.log('getCompanyProfile response in jobs screen:', res);
      if (res?.company) {
        setCompanyProfile(res.company);
      }
    } catch (error) {
      console.log('Error fetching company profile in jobs screen:', error);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  useEffect(() => {
    fetchCompanyProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchJobs(1);
      fetchCompanyProfile();
      setPage(1);
    });
    return unsubscribe;
  }, [navigation]);

  const handlePostJobPress = () => {
    if (!companyProfile) {
      Toast.show({
        type: 'error',
        text1: 'Loading Profile',
        text2: 'Loading profile details. Please try again in a moment.',
      });
      return;
    }
    // Check profile completeness (minimum 90% required to post job)
     const completeness = getProfileCompleteness(companyProfile);
     if (completeness.percentage < 90) {
       Toast.show({
         type: 'error',
         text1: 'Profile Incomplete',
         text2: `Complete your company profile to post a job (${completeness.percentage}% completed).`,
       });
       return;
     }
    const companyPackages = companyProfile?.company_packages || [];
    const activePackages = companyPackages.filter((p: any) => p.status === 'active');
    const activePackageObj = activePackages.length > 0
      ? [...activePackages].sort((a: any, b: any) => Number(b.id) - Number(a.id))[0]
      : null;

    if (!activePackageObj) {
      Toast.show({
        type: 'error',
        text1: 'Purchase Required',
        text2: 'Please purchase package',
      });
      return;
    }

    const used = Number(activePackageObj.used_job_posts || 0);
    const total = Number(activePackageObj.package?.no_of_job_post || 0);

    if (total > 0 && used >= total) {
      Toast.show({
        type: 'error',
        text1: 'Limit Exceeded',
        text2: `Job post limit exceeded. Used: ${used}/${total}`,
      });
      return;
    }

    navigation.navigate('PostJob');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs(page, true);
    setRefreshing(false);
  };

  const normalizedJobs = useMemo(() => {
    return (rawJobs || []).map((job: any) => normalizeBackendJob(job));
  }, [rawJobs]);

  const filtered = normalizedJobs.filter((j: any) => {
    const matchTab = j.status === activeTab;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase());
    const matchDept = !selected.Department?.length || selected.Department.includes(j.department);
    const matchLocation = !selected.Location?.length || selected.Location.includes(j.location);
    return matchTab && matchSearch && matchDept && matchLocation;
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
  console.log('job filtered', filtered)

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <MainManagerHeader
        title="Job Listings"
        subtitle={`${filtered.length} jobs found`}
        rightComponent={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handlePostJobPress}
          >
            <Plus color={Colors.white} size={RFValue(12)} strokeWidth={2.5} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color={Colors.textTertiary} size={RFValue(11)} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <SlidersHorizontal color={Colors.white} size={RFValue(11)} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow} contentContainerStyle={styles.tabsContent}>
        {TABS.map((tab: string) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
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
        {loading && normalizedJobs.length === 0 ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('3%') }} />
        ) : filtered.length > 0 ? (
          <>
            {filtered.map((job: any) => (
              <ActiveJobCard
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                vacancies={job.openings}
                applicants={job.applicants}
                status={job.status}
                onPress={() => navigation.navigate('ManagerJobDetails', { job })}
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
            <Text style={styles.emptyStateText}>No jobs found</Text>
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
  addBtn: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    paddingLeft: wp('4%'),
    // marginBottom: hp('1.2%'),
    // height: hp('5.5%'),
    maxHeight: hp('5%'),
  },
  tabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    paddingRight: wp('4%'),
  },
  tab: {
    paddingHorizontal: wp('2%'),
    minHeight: hp('3%'),
    marginVertical: hp('0.5%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%')
  },
  tabActive: { backgroundColor: Colors.primary, },
  tabText: { fontSize: RFValue(9), color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.white },
  list: { paddingHorizontal: wp('2%') },
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

export default ManagerJobsScreen;
