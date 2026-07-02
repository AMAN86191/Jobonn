import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TextInput, Pressable, ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { StatusType } from '../../components/Manager_component/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { getAppliedCandidatesSlice, getAllInvitationsSlice } from '../../redux/CompanyHomeSlice';
import {
  getAllSkills,
  getAllLocations,
  getJobDepartmentsMaster,
  getJobTitlesMaster
} from '../../api/CandidateJobProvider';

const TABS = ['Applied', 'Invited', 'Shortlisted','Hired', 'Rejected'];

const mapApiStatusToTab = (apiStatus: string) => {
  switch (apiStatus?.toLowerCase()) {
    case 'applied': return 'Applied';
    case 'shortlisted': return 'Shortlisted';
    // case 'interview_schedule':
    // case 'interview':
    //   return 'Interview Scheduled';
    case 'hired': return 'Hired';
    case 'rejected': return 'Rejected';
    case 'sent':
    case 'invited':
    case 'accepted':
      return 'Invited';
    default: return 'Applied';
  }
};

const mapTabToBadgeStatus = (tabName: string): StatusType => {
  switch (tabName) {
    case 'Applied': return 'New';
    case 'Invited': return 'Invited';
    case 'Shortlisted': return 'Shortlisted';
    // case 'Interview Scheduled': return 'Interview';
    case 'Hired': return 'Hired';
    case 'Rejected': return 'Rejected';
    default: return 'New';
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

const ManagerApplicantsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Applied');
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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
    'Job Type': [],
    'Experience': [],
    'Salary Range': [],
  });
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({
    'Job Title': [],
    'Department': [],
    'Skills': [],
    'Location': [],
    'Work Mode': [],
    'Job Type': [],
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
        title: 'Job Type',
        options: [
          { key: 'Full-Time', label: 'Full-Time' },
          { key: 'Part-Time', label: 'Part-Time' },
          { key: 'Contract', label: 'Contract' },
          { key: 'Internship', label: 'Internship' },
        ],
      },
      { title: 'Experience', type: 'range', options: [] },
      { title: 'Salary Range', type: 'range', options: [] },
    ];
  }, [skillsOptions, locationOptions, departmentOptions, jobTitleOptions]);

  const [appliedCandidates, setAppliedCandidates] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const handleSearchSubmit = () => {
    setPage(1);
    setActiveSearch(search);
  };

  // Construct API payload for filtering
  const apiFilters = useMemo(() => {
    const filters: any = {};
    if (selectedFilters['Job Title']?.length > 0) {
      filters.job_title_id = selectedFilters['Job Title'][0];
    }
    const selectedJobTypes = selectedFilters['Job Type'] || [];
    if (selectedJobTypes.length > 0) {
      filters.job_type = selectedJobTypes[0].toLowerCase().replace(' ', '_');
    }
    if (selectedFilters['Skills']?.length > 0) {
      filters.skills = selectedFilters['Skills'];
    }
    if (selectedFilters['Location']?.length > 0) {
      const selectedKeys = selectedFilters['Location'];
      const locationLabels = selectedKeys.map(key => {
        const option = locationOptions.find(o => o.key === key);
        return option ? option.label : key;
      });
      filters.location = locationLabels[0];
    }
    if (selectedFilters['Experience']?.length === 2) {
      filters.min_experience = selectedFilters['Experience'][0];
      filters.max_experience = selectedFilters['Experience'][1];
    }
    if (selectedFilters['Salary Range']?.length === 2) {
      filters.min_salary = selectedFilters['Salary Range'][0];
      filters.max_salary = selectedFilters['Salary Range'][1];
    }
    if (activeSearch.trim().length > 0) {
      filters.search = activeSearch.trim();
    }
    return filters;
  }, [selectedFilters, activeSearch, locationOptions]);

  const fetchApplicants = async (pageNum: number, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const response = await dispatch(getAppliedCandidatesSlice({ page: pageNum, filters: apiFilters }) as any).unwrap();
      console.log('getAppliedCandidates response:', response);
      const list = response?.applications?.data || [];
      setAppliedCandidates(list);
      setLastPage(response?.applications?.last_page || 1);
      setTotalCandidates(response?.applications?.total || 0);

      const invitationsRes = await dispatch(getAllInvitationsSlice() as any).unwrap();
      console.log('getAllInvitations response:', invitationsRes);
      const rawInvites = invitationsRes?.invitations?.data || invitationsRes?.data || [];
      setInvitations(rawInvites);
    } catch (error) {
      console.log('Error fetching applied candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(page);
  }, [page, apiFilters]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1);
      fetchApplicants(1);
    });
    return unsubscribe;
  }, [navigation, apiFilters]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplicants(page, true);
    setRefreshing(false);
  };

  const normalizedApplicants = useMemo(() => {
    const list: any[] = [];

    // Map direct applications
    (appliedCandidates || []).forEach((item: any) => {
      const cand = item.candidate || {};
      const job = item.applied_job || {};

      const currentCTC = cand.current_ctc ? `${cand.current_ctc} LPA` : undefined;
      const expectedCTC = cand.expected_salary ? `${cand.expected_salary} LPA` : undefined;
      const mappedStatus = mapApiStatusToTab(item.status);

      // Skills normalization
      const rawSkills = cand.skills || cand.professional_detail?.skills || [];
      const candidateSkills = Array.isArray(rawSkills)
        ? rawSkills.map((s: any) => {
            if (typeof s === 'string') return s;
            if (s && typeof s === 'object') return s.skill_name || s.name || s.skill || '';
            return '';
          }).filter(Boolean)
        : (typeof rawSkills === 'string' ? rawSkills.split(',').map((s: string) => s.trim()) : []);

      // Work Mode normalization
      const workModeStr = job.work_mode || job.workMode || (job.job_type === 'remote' || job.job_type?.toLowerCase() === 'remote' ? 'Remote' : (job.job_type === 'hybrid' || job.job_type?.toLowerCase() === 'hybrid' ? 'Hybrid' : 'On-site'));

      // Department normalization
      const deptStr = job.department?.department_name || (typeof job.department === 'string' ? job.department : '') || '';

      list.push({
        id: `app-${item.id}`,
        applicationId: item.id,
        user_id: item.user_id,
        candidate_id: cand.id,
        name: cand.name || '',
        role: cand.job_title || cand.professional_detail?.job_title || '',
        experience: cand.experience || cand.professional_detail?.experience || 'Fresher',
        location: cand.location || cand.professional_detail?.current_location || '',
        status: mapTabToBadgeStatus(mappedStatus),
        atsStage: mappedStatus,
        currentCTC: currentCTC,
        expectedCTC: expectedCTC,
        time: formatTimeAgo(item.applied_at || item.created_at),
        image: cand.profile_img ? { uri: cand.profile_img } : undefined,
        emailAddress: cand.email || '',
        phoneNumber: cand.phone || '',
        whatsappNumber: cand.phone || '',
        noticePeriod: cand.notice_period || 'Immediate',
        preferredLocation: cand.location || '',
        jobType: job.job_type || '',
        appliedJob: job.job_title || '',
        rawApplication: item,
        isInvitation: false,
        skills: candidateSkills,
        workMode: workModeStr,
        department: deptStr,
      });
    });

    // Map invitations
    (invitations || []).forEach((invite: any) => {
      const cand = invite.candidate || {};
      const job = invite.job || {};

      const name = cand.name || cand.user?.name || '';
      const email = cand.email || cand.user?.email || '';

      const role = cand.professional_detail?.job_title || cand.job_title || cand.role || '';
      const experience = cand.professional_detail?.experience || cand.experience || 'Fresher';

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

      const rawCurrentCTC = cand.professional_detail?.current_ctc || cand.current_ctc;
      const currentCTC = rawCurrentCTC ? `${rawCurrentCTC} LPA` : undefined;

      const rawExpectedCTC = cand.professional_detail?.expected_salary || cand.expected_salary;
      const expectedCTC = rawExpectedCTC ? `${rawExpectedCTC} LPA` : undefined;

      const profileImg = cand.profile_img || cand.docs?.profile_img || cand.image;
      const noticePeriod = cand.professional_detail?.notice_period || cand.notice_period || 'Immediate';

      const mappedStatus = mapApiStatusToTab(invite.status);

      // Skills normalization
      const rawSkills = cand.skills || cand.professional_detail?.skills || [];
      const candidateSkills = Array.isArray(rawSkills)
        ? rawSkills.map((s: any) => {
            if (typeof s === 'string') return s;
            if (s && typeof s === 'object') return s.skill_name || s.name || s.skill || '';
            return '';
          }).filter(Boolean)
        : (typeof rawSkills === 'string' ? rawSkills.split(',').map((s: string) => s.trim()) : []);

      // Work Mode normalization
      const workModeStr = job.work_mode || job.workMode || (job.job_type === 'remote' || job.job_type?.toLowerCase() === 'remote' ? 'Remote' : (job.job_type === 'hybrid' || job.job_type?.toLowerCase() === 'hybrid' ? 'Hybrid' : 'On-site'));

      // Department normalization
      const deptStr = job.department?.department_name || (typeof job.department === 'string' ? job.department : '') || '';

      list.push({
        id: `invite-${invite.id}`,
        invitationId: invite.id,
        user_id: cand.user_id,
        candidate_id: cand.id,
        name,
        role,
        experience,
        location,
        status: mapTabToBadgeStatus(mappedStatus),
        atsStage: mappedStatus,
        currentCTC,
        expectedCTC,
        time: formatTimeAgo(invite.created_at || invite.updated_at),
        image: profileImg ? { uri: profileImg.startsWith('http') ? profileImg : `https://admin.jobonn.in/storage/${profileImg}` } : undefined,
        emailAddress: email,
        phoneNumber: cand.phone || '',
        whatsappNumber: cand.phone || '',
        noticePeriod,
        preferredLocation: location,
        jobType: job.job_type || '',
        appliedJob: job.job_title?.job_name || job.job_title || job.title || '',
        rawApplication: invite,
        isInvitation: true,
        skills: candidateSkills,
        workMode: workModeStr,
        department: deptStr,
      });
    });

    return list;
  }, [appliedCandidates, invitations]);

  const filtered = normalizedApplicants.filter((a: any) => {
    const matchTab = a.atsStage === activeTab || a.status === activeTab;
    const matchSearch = !activeSearch.trim().length ||
      a.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(activeSearch.toLowerCase());

    // Job Title Filter
    const selectedJobTitles = selectedFilters['Job Title']?.map(key => jobTitleOptions.find(o => o.key === key)?.label).filter(Boolean) || [];
    const matchJobTitle = !selectedJobTitles.length || selectedJobTitles.some(title => a.role?.toLowerCase().includes(title.toLowerCase()));

    // Department Filter
    const selectedDepts = selectedFilters.Department?.map(key => departmentOptions.find(o => o.key === key)?.label).filter(Boolean) || [];
    const matchDept = !selectedDepts.length || selectedDepts.some(dept => a.department?.toLowerCase().includes(dept.toLowerCase()));

    // Skills Filter
    const selectedSkillNames = selectedFilters.Skills?.map(key => skillsOptions.find(o => o.key === key)?.label).filter(Boolean) || [];
    const matchSkills = !selectedSkillNames.length || selectedSkillNames.some(skillName => a.skills?.some((s: string) => s.toLowerCase().includes(skillName.toLowerCase())));

    // Experience Range Filter
    let matchExp = true;
    if (selectedFilters.Experience?.length === 2) {
      const minExp = parseInt(selectedFilters.Experience[0]);
      const maxExp = parseInt(selectedFilters.Experience[1]);
      const expVal = parseInt(a.experience) || 0;
      matchExp = expVal >= minExp && expVal <= maxExp;
    }

    // Salary Range Filter
    let matchSalary = true;
    if (selectedFilters['Salary Range']?.length === 2) {
      const minSal = parseInt(selectedFilters['Salary Range'][0]);
      const maxSal = parseInt(selectedFilters['Salary Range'][1]);
      const salVal = parseInt(a.currentCTC) || 0;
      matchSalary = salVal >= minSal && salVal <= maxSal;
    }

    // Job Type Filter
    const matchJobType = !selectedFilters['Job Type']?.length || selectedFilters['Job Type'].some((type: string) => a.jobType?.toLowerCase().replace('-', ' ').includes(type.toLowerCase().replace('-', ' ')));

    // Work Mode Filter
    // const matchWorkMode = !selectedFilters['Work Mode']?.length || selectedFilters['Work Mode'].some((mode: string) => a.workMode?.toLowerCase().includes(mode.toLowerCase()));

    // Location Filter
    const selectedLocs = selectedFilters.Location?.map(key => locationOptions.find(o => o.key === key)?.label).filter(Boolean) || [];
    const matchLocation = !selectedLocs.length || selectedLocs.some(loc => a.location?.toLowerCase().includes(loc.toLowerCase()));

    return matchTab && matchSearch;
  });

  const handleOpenFilter = () => {
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
    setPage(1);
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
      'Job Type': [],
      'Experience': [],
      'Salary Range': [],
    };
    setPage(1);
    setTempFilters(resetVal);
    setSelectedFilters(resetVal);
    setFilterVisible(false);
  };

  const handleRemoveFilter = (section: string, key: string) => {
    setPage(1);
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
          <TouchableOpacity onPress={handleSearchSubmit} activeOpacity={0.7} style={{ marginRight: wp('1.5%') }}>
            <Search color={Colors.textTertiary} size={RFValue(11)} strokeWidth={2} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or role..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              if (!text.trim()) {
                setPage(1);
                setActiveSearch('');
              }
            }}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
        <Pressable style={styles.filterBtn} onPress={handleOpenFilter}>
          <SlidersHorizontal color={Colors.white} size={RFValue(11)} strokeWidth={2} />
        </Pressable>
      </View>

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
        sections={filterSections}
        selected={tempFilters}
        onSelect={handleSelectFilter}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
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

export default ManagerApplicantsScreen;
