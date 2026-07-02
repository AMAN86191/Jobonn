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
import { ArrowLeft, ArrowRight, X } from 'lucide-react-native';
import {
  getAllSkills,
  getAllLocations,
  getJobDepartmentsMaster,
  getJobTitlesMaster
} from '../../api/CandidateJobProvider';

const FILTERS = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];


const CandidateJobsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const [rawJobs, setRawJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState<number>(1);
  console.log('jobs response local state', rawJobs);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic filter options state
  const [skillsOptions, setSkillsOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);


  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    'Job Title': [],
    'Department': [],
    'Skills': [],
    'Location': [],
    'Work Mode': [],
    'Experience': [],
    'Salary Range': [],
  });
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({
    'Job Title': [],
    'Department': [],
    'Skills': [],
    'Location': [],
    'Work Mode': [],
    'Experience': [],
    'Salary Range': [],
  });

  // Fetch dynamic master lists from the APIs
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [skillsRes, locationsRes, deptsRes, titlesRes] = await Promise.all([
          getAllSkills(),
          getAllLocations(),
          getJobDepartmentsMaster(),
          getJobTitlesMaster(),
        ]);

        console.log('all-skills response:', skillsRes);
        console.log('all-locations response:', locationsRes);
        console.log('job-departments response:', deptsRes);
        console.log('job-titles response:', titlesRes);

        const skillsList = skillsRes?.skills || skillsRes?.data || skillsRes || [];
        setSkillsOptions(
          skillsList.map((item: any) => ({
            key: String(item.id),
            label: item.skill_name || item.name || item.title || '',
          })).filter((item: any) => item.label)
        );

        const locsList = locationsRes?.locations || locationsRes?.location || locationsRes?.data || locationsRes || [];
        setLocationOptions(
          locsList.map((item: any) => ({
            key: String(item.id || item.location_name || item),
            label: item.location_name || item.name || String(item),
          })).filter((item: any) => item.label)
        );

        const deptsList = deptsRes?.departments || deptsRes?.job_departments || deptsRes?.data || deptsRes || [];
        setDepartmentOptions(
          deptsList.map((item: any) => ({
            key: String(item.id),
            label: item.department_name || item.name || '',
          })).filter((item: any) => item.label)
        );

        const titlesList = titlesRes?.titles || titlesRes?.job_titles || titlesRes?.data || titlesRes || [];
        setJobTitleOptions(
          titlesList.map((item: any) => ({
            key: String(item.id),
            label: item.job_name || item.name || item.title || '',
          })).filter((item: any) => item.label)
        );
      } catch (err) {
        console.log('Error loading dynamic filter options:', err);
      }
    };
    loadFilters();
  }, []);

  const filterSections = useMemo<FilterSection[]>(() => {
    return [
      {
        title: 'Job Title',
        type: 'searchable-multi',
        options: jobTitleOptions,
      },
      // {
      //   title: 'Department',
      //   type: 'searchable-multi',
      //   options: departmentOptions,
      // },
      {
        title: 'Skills',
        type: 'searchable-multi',
        options: skillsOptions,
      },
      {
        title: 'Location',
        type: 'searchable-multi',
        options: locationOptions,
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
  }, [skillsOptions, locationOptions, departmentOptions, jobTitleOptions]);

  const activeJobTypes = useMemo(() => {
    const list: string[] = [];
    if (activeFilter !== 'All') {
      list.push(activeFilter.toLowerCase().replace('-', '_'));
    }
    const selectedModes = selectedFilters['Work Mode'] || [];
    selectedModes.forEach(mode => {
      list.push(mode.toLowerCase().replace('-', '_'));
    });
    return list;
  }, [activeFilter, selectedFilters]);

  // Construct API payload for filtering
  const apiFilters = useMemo(() => {
    const filters: any = {};
    if (selectedFilters['Job Title']?.length > 0) {
      filters.job_title_id = selectedFilters['Job Title'][0];
    }
    if (activeJobTypes.length > 0) {
      filters.job_types = activeJobTypes;
    }
    if (selectedFilters['Skills']?.length > 0) {
      filters.skills = selectedFilters['Skills'].join(',');
    }
    if (selectedFilters['Location']?.length > 0) {
      filters.location_id = selectedFilters['Location'].join(',');
    }
    if (selectedFilters['Department']?.length > 0) {
      filters.department_id = selectedFilters['Department'][0];
    }
    if (selectedFilters['Experience']?.length === 2) {
      filters.experience_from = selectedFilters['Experience'][0];
      filters.experience_to = selectedFilters['Experience'][1];
    }
    if (selectedFilters['Salary Range']?.length === 2) {
      filters.salary_from = selectedFilters['Salary Range'][0];
      filters.salary_to = selectedFilters['Salary Range'][1];
    }
    return filters;
  }, [selectedFilters, activeJobTypes]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchCandidateJobsSlice({ page, filters: apiFilters }) as any).unwrap();
        console.log('fetchCandidateJobs response in component:', response);
        if (response?.status) {
          const jobsData = response.jobs || {};
          setRawJobs(jobsData.data || []);
          setLastPage(jobsData.last_page || 1);
        } else {
          setRawJobs([]);
          setLastPage(1);
        }
      } catch (err) {
        console.log('Error fetching candidate jobs in component:', err);
        setRawJobs([]);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [dispatch, page, apiFilters]);

  const normalizedJobs = useMemo(() => {
    return (rawJobs || []).map((job: any) => normalizeBackendJob(job));
  }, [rawJobs]);

  const handleOpenFilter = () => {
    console.log('handleOpenFilter clicked, setting filterVisible to true');
    setTempFilters(selectedFilters);
    setFilterVisible(true);
  };

  const handleSelectFilter = (section: string, key: string) => {
    setTempFilters(prev => {
      const current = prev[section] || [];
      if (key.startsWith('range:')) {
        const [min, max] = key.replace('range:', '').split('-');
        return { ...prev, [section]: [min, max] };
      }
      const updated = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key];
      return { ...prev, [section]: updated };
    });
  };

  const handleApplyFilter = () => {
    setSelectedFilters(tempFilters);
    setFilterVisible(false);
  };

  const handleResetFilter = () => {
    const resetVal = {
      'Job Title': [],
      'Department': [],
      'Skills': [],
      'Location': [],
      'Work Mode': [],
      'Experience': [],
      'Salary Range': [],
    };
    setTempFilters(resetVal);
    setSelectedFilters(resetVal);
    setFilterVisible(false);
  };

  const handleRemoveFilter = (section: string, key: string) => {
    setSelectedFilters(prev => {
      const current = prev[section] || [];
      let updated: string[] = [];
      if (key === 'range') {
        updated = [];
      } else {
        updated = current.filter(k => k !== key);
      }
      return { ...prev, [section]: updated };
    });
  };

  let jobsFiltered = normalizedJobs;

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
          onFilterPress={handleOpenFilter}
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

        {/* Active Filter Chips */}
        {(() => {
          const activeList: { section: string; key: string; label: string }[] = [];
          Object.keys(selectedFilters).forEach(section => {
            const vals = selectedFilters[section] || [];
            if (section === 'Experience' || section === 'Salary Range') {
              if (vals.length === 2) {
                const label = section === 'Experience'
                  ? `${vals[0]}-${vals[1]} Yrs`
                  : `${vals[0]}-${vals[1]} LPA`;
                activeList.push({ section, key: 'range', label });
              }
            } else {
              vals.forEach(key => {
                const sec = filterSections.find(s => s.title === section);
                const opt = sec?.options?.find(o => o.key === key);
                const label = opt ? opt.label : key;
                activeList.push({ section, key, label });
              });
            }
          });

          if (activeList.length === 0) return null;

          return (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.activeChipsScroll}
              contentContainerStyle={styles.activeChipsContent}
            >
              {activeList.map((item, idx) => (
                <TouchableOpacity
                  key={`${item.section}-${item.key}-${idx}`}
                  style={styles.activeChip}
                  onPress={() => handleRemoveFilter(item.section, item.key)}
                >
                  <Text style={styles.activeChipText}>{item.label}</Text>
                  <X color={Colors.primary} size={RFValue(8.5)} style={{ marginLeft: wp('1%') }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          );
        })()}

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
          sections={filterSections}
          selected={tempFilters}
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
  activeChipsScroll: {
    marginVertical: hp('0.5%'),
    flexGrow: 0,
  },
  activeChipsContent: {
    gap: wp('1.5%'),
    paddingHorizontal: wp('2%'),
    alignItems: 'center',
    paddingBottom: hp('0.5%'),
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.primary + '08',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  activeChipText: {
    fontSize: RFValue(8.5),
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default CandidateJobsScreen;
