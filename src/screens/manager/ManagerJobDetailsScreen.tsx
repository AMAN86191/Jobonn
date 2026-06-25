import React, { useState, useMemo } from 'react';
import {
  View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Filter, UserCheck, Calendar } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import JobDetailInfoCard from '../../components/Manager_component/JobDetailInfoCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { talentDatabase, jobs } from '../../data/jobonnStaticData';
import { normalizeBackendJob } from '../../utils/jobNormalizer';

const APPLICANTS = talentDatabase;
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
const TABS = ['New', 'Shortlisted', 'Invited', 'Accepted Invite', 'Interview', 'Selected', 'Hired', 'Rejected'];
const ManagerJobDetailsScreen = ({ navigation, route }: any) => {
  const rawJob = route.params?.job;
  const job = useMemo(() => {
    if (!rawJob) return jobs[0];
    if ('workMode' in rawJob) return rawJob;
    return normalizeBackendJob(rawJob);
  }, [rawJob]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('New');
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const stats = [
    { label: 'Applicants', value: job.applicants?.toString() || '0', icon: Users, color: Colors.primary },
    { label: 'Shortlisted', value: job.shortlisted?.toString() || '0', icon: UserCheck, color: Colors.success },
    { label: 'Interviews', value: job.interviewed?.toString() || '0', icon: Calendar, color: Colors.warning },
  ];
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


  const filtered = APPLICANTS.filter(a => a.atsStage === activeTab || a.status === activeTab);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <CommanManagerHeader navigation={navigation} title="Job Details" showEdit onRightPress={() => navigation.navigate('PostJob', { job })} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <JobDetailInfoCard job={job} stats={stats} />

        <View style={styles.applicantsHeader}>
          <Text style={styles.sectionTitle}>Applicants ({filtered.length})</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <Filter color={Colors.textSecondary} size={RFValue(10)} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContent}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            <Text style={styles.emptyStateText}>Candidate not found</Text>
          </View>
        )}

        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          sections={FILTER_SECTIONS}
          selected={selected}
          onSelect={handleFilterSelect}
          onApply={() => setFilterVisible(false)}
          onReset={() => setSelected({})}
        />

        <View style={{ height: hp('5%') }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: wp('4%') },
  applicantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
    marginTop: hp('1%'),
  },
  sectionTitle: { fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary },
  filterBtn: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsScroll: { marginBottom: hp('1%') },
  tabsContent: { gap: wp('2%') },
  tab: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('4%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTab: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: RFValue(9), color: Colors.textSecondary, fontWeight: '600' },
  activeTabText: { color: Colors.white },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('8%'),
    backgroundColor: Colors.white,
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: hp('2%'),
  },
  emptyStateText: {
    fontSize: RFValue(11),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});

export default ManagerJobDetailsScreen;
