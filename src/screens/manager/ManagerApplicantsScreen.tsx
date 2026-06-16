import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TextInput, Pressable,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { talentDatabase } from '../../data/jobonnStaticData';

const TABS = ['New', 'Shortlisted', 'Invited', 'Accepted Invite', 'Interview', 'Hired', 'Rejected'];

const ALL_APPLICANTS = talentDatabase;

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
  const [activeTab, setActiveTab] = useState('New');
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const filtered = ALL_APPLICANTS.filter(a => {
    const matchTab = a.atsStage === activeTab || a.status === activeTab;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase());

    // Department Filter
    const matchDept = !selected.Department?.length || selected.Department.includes(a.department);

    // Skills Filter
    const matchSkills = !selected.Skills?.length || selected.Skills.some(skill => a.skills.includes(skill));

    // Experience Range Filter
    let matchExp = true;
    if (selected.Experience?.length === 2) {
      const minExp = parseInt(selected.Experience[0]);
      const maxExp = parseInt(selected.Experience[1]);
      matchExp = a.experienceVal >= minExp && a.experienceVal <= maxExp;
    }

    // Salary Range Filter
    let matchSalary = true;
    if (selected['Salary Range']?.length === 2) {
      const minSal = parseInt(selected['Salary Range'][0]);
      const maxSal = parseInt(selected['Salary Range'][1]);
      matchSalary = a.salary >= minSal && a.salary <= maxSal;
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
    const matchBenefits = !selected.Benefits?.length || selected.Benefits.some(benefit => a.benefits.includes(benefit));

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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <MainManagerHeader
        title="Applicants"
        subtitle={`${ALL_APPLICANTS.length} total candidates`}
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

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map(applicant => (
            <CandidateCard
              key={applicant.id}
              {...applicant}
              avatarColor={getAvatarColor(applicant.name)}
              onPress={() => navigation.navigate('CandidateApplicationFullView', { applicant })}
            />
          ))
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
    // marginBottom: hp('1.2%'),
    // height: hp('5.5%'),
    maxHeight: hp('5%'),
  },
  tabsContent: {
    flexDirection: 'row',
    gap: wp('2.5%'),
    paddingRight: wp('4%'),
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
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
});

export default ManagerApplicantsScreen;
