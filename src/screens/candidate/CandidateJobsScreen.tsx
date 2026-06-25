import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchBar from '../../components/Candidate_component/SearchBar';
import JobCard from '../../components/Candidate_component/JobCard';
import { SafeAreaView } from 'react-native-safe-area-context';

import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateJobsSlice } from '../../redux/CandidateJobSlice';
import { normalizeBackendJob } from '../../utils/jobNormalizer';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const FILTERS = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];


const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Sort By',
    options: [
      { key: 'experience_desc', label: 'Experience: High to Low' },
      { key: 'experience_asc', label: 'Experience: Low to High' },
    ],
  },
  {
    title: 'Skills',
    type: 'searchable-multi',
    options: [
      { key: 'React Native', label: 'React Native' },
      { key: 'TypeScript', label: 'TypeScript' },
      { key: 'Laravel', label: 'Laravel' },
      { key: 'Figma', label: 'Figma' },
      { key: 'ATS', label: 'ATS' },
    ],
  },
  {
    title: 'Location',
    type: 'searchable-multi',
    options: [
      { key: 'bangalore', label: 'Bangalore' },
      { key: 'remote', label: 'Remote' },
      { key: 'hyderabad', label: 'Hyderabad' },
      { key: 'pune', label: 'Pune' },
    ]
  },
  {
    title: 'Work Mode',
    options: [
      { key: 'Remote', label: 'Remote' },
      { key: 'Hybrid', label: 'Hybrid' },
      { key: 'On-site', label: 'On-site' },
    ],
  },
  { title: 'Experience', type: 'range', options: [] },
  { title: 'Salary Range', type: 'range', options: [] },
];

const CandidateJobsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { jobs: rawJobs, loading, lastPage } = useSelector((state: any) => state.candidateJobs);

  const [activeFilter, setActiveFilter] = useState('All');
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    'Sort By': [],
    'Skills': [],
    'Location': [],
    'Work Mode': [],
    'Experience': [],
    'Salary Range': [],
  });

  useEffect(() => {
    dispatch(fetchCandidateJobsSlice(page) as any);
  }, [dispatch, page]);

  const normalizedJobs = useMemo(() => {
    return (rawJobs || []).map((job: any) => normalizeBackendJob(job));
  }, [rawJobs]);

  const handleSelectFilter = (section: string, key: string) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key];
      return { ...prev, [section]: updated };
    });
  };

  const handleApplyFilter = () => {
    setFilterVisible(false);
  };

  const handleResetFilter = () => {
    setSelectedFilters({
      'Sort By': [],
      'Skills': [],
      'Location': [],
      'Work Mode': [],
      'Experience': [],
      'Salary Range': [],
    });
    setFilterVisible(false);
  };
console.log('normalizedJobs', normalizedJobs)
  let jobsFiltered = activeFilter === 'All'
    ? [...normalizedJobs]
    : normalizedJobs.filter((j: any) => {
      const filter = activeFilter.toLowerCase();
      return j.job_type.toLowerCase() === filter || j.workMode.toLowerCase() === filter;
    });

  // Apply search query filter
  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase();
    jobsFiltered = jobsFiltered.filter((j: any) =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.location.toLowerCase().includes(query) ||
      j.skills.some((skill: any) => skill.toLowerCase().includes(query))
    );
  }

  // Apply location filter from FilterModal
  const selectedLocs = selectedFilters.Location || [];
  if (selectedLocs.length > 0) {
    jobsFiltered = jobsFiltered.filter((j: any) =>
      selectedLocs.some(loc => j.location.toLowerCase().includes(loc.toLowerCase()))
    );
  }

  const selectedSkills = selectedFilters.Skills || [];
  if (selectedSkills.length > 0) {
    jobsFiltered = jobsFiltered.filter((j: any) =>
      selectedSkills.some((skill: any) => j.skills.includes(skill))
    );
  }

  const selectedModes = selectedFilters['Work Mode'] || [];
  if (selectedModes.length > 0) {
    jobsFiltered = jobsFiltered.filter((j: any) => selectedModes.includes(j.workMode));
  }

  if (selectedFilters.Experience?.length === 2) {
    const min = parseInt(selectedFilters.Experience[0]) || 0;
    const max = parseInt(selectedFilters.Experience[1]) || 99;
    jobsFiltered = jobsFiltered.filter((j: any) => {
      const exp = parseInt(j.type) || 0;
      return exp >= min && exp <= max;
    });
  }

  // Sort jobs from FilterModal
  const sortBy = selectedFilters['Sort By']?.[0];
  if (sortBy === 'experience_desc') {
    jobsFiltered.sort((a: any, b: any) => parseInt(b.type) - parseInt(a.type));
  } else if (sortBy === 'experience_asc') {
    jobsFiltered.sort((a: any, b: any) => parseInt(a.type) - parseInt(b.type));
  }
  console.log('jobsFiltered', jobsFiltered)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find Jobs</Text>
          <Text style={styles.headerSub}>Discover your next career move</Text>
        </View>

        <SearchBar
          placeholder="Search jobs, skills, or companies..."
          onFilterPress={() => setFilterVisible(true)}
          onSearch={setSearchQuery}
          value={searchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          <Text style={styles.resultCount}>{jobsFiltered.length} jobs found</Text>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('3%') }} />
          ) : (
            <>
              {jobsFiltered.length === 0 ? (
                <Text style={{ textAlign: 'center', color: Colors.textTertiary, marginVertical: hp('2%'), fontSize: RFValue(10) }}>No jobs found</Text>
              ) : (
                jobsFiltered.map((job: any) => (
                  <JobCard
                    key={job.id}
                    {...job}
                    onPress={() => navigation.navigate('JobDetails', { job })}
                  />
                ))
              )}

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
          )}
          <View style={{ height: hp('15%') }} />
        </ScrollView>

        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          sections={FILTER_SECTIONS}
          selected={selectedFilters}
          onSelect={handleSelectFilter}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: wp('2%'), },
  container: { flex: 1 },
  header: {
    paddingTop: hp('0.5%'),
    paddingBottom: hp('1%'),
  },
  headerTitle: { fontSize: RFValue(15), fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: RFValue(8.5), color: Colors.textTertiary, marginTop: hp('0.2%') },
  filterRow: { marginBottom: hp('0.3%'), flexGrow: 0 },
  filterContent: { gap: wp('2%'), paddingVertical: hp('1%'), alignItems: 'center' },
  filterChip: {
    paddingHorizontal: wp('4%'),
    minHeight: hp('3%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: RFValue(9.5),
    color: Colors.textSecondary,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  filterTextActive: { color: Colors.white },
  listContent: {},
  resultCount: { fontSize: RFValue(8.5), color: Colors.textTertiary, fontWeight: '500', marginBottom: hp('1%') },
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

export default CandidateJobsScreen;
