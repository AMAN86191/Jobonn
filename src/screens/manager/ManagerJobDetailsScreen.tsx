import React, { useState, useMemo, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar, Modal, ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Filter, UserCheck, Calendar, XCircle, Check } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import CandidateCard, { getAvatarColor } from '../../components/Manager_component/CandidateCard';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import JobDetailInfoCard from '../../components/Manager_component/JobDetailInfoCard';
import FilterModal, { FilterSection } from '../../components/Manager_component/FilterModal';
import { talentDatabase, jobs } from '../../data/jobonnStaticData';
import { normalizeBackendJob } from '../../utils/jobNormalizer';
import { useDispatch } from 'react-redux';
import { updateJobStatusSlice } from '../../redux/CompanyHomeSlice';
import Toast from 'react-native-toast-message';
import { getJobAppliedCandidates } from '../../api/CompanyHomeProvider';
import { StatusType } from '../../components/Manager_component/StatusBadge';
const mapApiStatusToTab = (apiStatus: string) => {
  switch (apiStatus?.toLowerCase()) {
    case 'applied': return 'Applied';
    case 'shortlisted': return 'Shortlisted';
    case 'interview_schedule':
    case 'interview':
      return 'Interview Scheduled';
    case 'hired': return 'Hired';
    case 'rejected': return 'Rejected';
    default: return 'Applied';
  }
};

const mapTabToBadgeStatus = (tabName: string): StatusType => {
  switch (tabName) {
    case 'Applied': return 'New';
    case 'Shortlisted': return 'Shortlisted';
    case 'Interview Scheduled': return 'Interview';
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
const TABS = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Hired', 'Rejected'];
const ManagerJobDetailsScreen = ({ navigation, route }: any) => {
  const rawJob = route.params?.job;
  const job = useMemo(() => {
    if (!rawJob) return jobs[0];
    if ('workMode' in rawJob) return rawJob;
    return normalizeBackendJob(rawJob);
  }, [rawJob]);

  const dispatch = useDispatch();
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Applied');
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [statusVisible, setStatusVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getInitialStatus = () => {
    const s = (job.status || 'Active').toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const [jobStatus, setJobStatus] = useState(getInitialStatus());

  useEffect(() => {
    setJobStatus(getInitialStatus());
  }, [job]);

  const statusOptions = [
    {
      key: 'Draft',
      description: 'Saved as draft, not visible to candidates',
      color: Colors.textSecondary,
      dotColor: Colors.textSecondary,
      activeStyle: { backgroundColor: Colors.borderLight, borderColor: Colors.textSecondary },
    },
    {
      key: 'Active',
      description: 'Visible to candidates, open for applications',
      color: Colors.success,
      dotColor: Colors.success,
      activeStyle: styles.statusOptionActiveActive,
    },
    {
      key: 'Closed',
      description: 'Hidden from candidates, closed for applications',
      color: Colors.danger,
      dotColor: Colors.danger,
      activeStyle: styles.statusOptionActiveClosed,
    },
    {
      key: 'Expired',
      description: 'Application deadline has passed',
      color: Colors.warning,
      dotColor: Colors.warning,
      activeStyle: { backgroundColor: Colors.warningLight, borderColor: Colors.warning },
    },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (jobStatus.toLowerCase() === newStatus.toLowerCase()) {
      setStatusVisible(false);
      return;
    }

    setUpdating(true);
    try {
      await dispatch(updateJobStatusSlice({ jobId: job.id, status: newStatus.toLowerCase() }) as any).unwrap();
      setJobStatus(newStatus);
      Toast.show({
        type: 'success',
        text1: 'Status Updated',
        text2: `Job status updated to ${newStatus} successfully!`,
      });
      setStatusVisible(false);
    } catch (error: any) {
      console.error('Failed to update job status:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.message || 'Could not update job status.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const [appliedCandidates, setAppliedCandidates] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const fetchJobApplicants = async () => {
    setLoadingApplicants(true);
    try {
      const res = await getJobAppliedCandidates(job.id);
      console.log('getJobAppliedCandidates response:', res);
      const list = res?.applications?.data || res?.data || [];
      setAppliedCandidates(list);
    } catch (error) {
      console.log('Error fetching applied candidates for job:', error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    fetchJobApplicants();
  }, [job.id]);

  const normalizedApplicants = useMemo(() => {
    return (appliedCandidates || []).map((item: any) => {
      const cand = item.candidate || {};
      const jobObj = item.applied_job || {};

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
        jobType: jobObj.job_type || '',
        appliedJob: jobObj.job_title || '',
        rawApplication: item,
      };
    });
  }, [appliedCandidates]);

  const filtered = useMemo(() => {
    return normalizedApplicants.filter(a => a.atsStage === activeTab || a.status === activeTab);
  }, [normalizedApplicants, activeTab]);
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <CommanManagerHeader navigation={navigation} title="Job Details" showEdit onRightPress={() => navigation.navigate('UpdateJobScreen', { job })} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <JobDetailInfoCard
          job={job}
          stats={stats}
          jobStatus={jobStatus}
          onStatusPress={() => setStatusVisible(true)}
        />

        <View style={styles.applicantsHeader}>
          <Text style={styles.sectionTitle}>Applicants ({filtered.length})</Text>
          {/* <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <Filter color={Colors.textSecondary} size={RFValue(10)} strokeWidth={2} />
          </TouchableOpacity> */}
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

        {loadingApplicants ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('3%') }} />
        ) : filtered.length > 0 ? (
          filtered.map(applicant => (
            <CandidateCard
              key={applicant.id}
              {...applicant}
              appliedJob={undefined}
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

        <Modal
          animationType="fade"
          transparent
          visible={statusVisible}
          onRequestClose={() => setStatusVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Job Status</Text>
                <TouchableOpacity onPress={() => setStatusVisible(false)}>
                  <XCircle size={RFValue(16)} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                {updating ? (
                  <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: hp('3%') }} />
                ) : (
                  statusOptions.map((opt) => {
                    const isSelected = jobStatus.toLowerCase() === opt.key.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        style={[
                          styles.statusOption,
                          isSelected && opt.activeStyle,
                        ]}
                        onPress={() => handleStatusChange(opt.key)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionLeft}>
                          <View style={[styles.statusDot, { backgroundColor: opt.dotColor }]} />
                          <View style={{ flex: 1 }}>
                            <Text style={[
                              styles.optionTitle,
                              isSelected && { color: opt.color, fontWeight: '700' }
                            ]}>
                              {opt.key}
                            </Text>
                            <Text style={styles.optionDescription}>{opt.description}</Text>
                          </View>
                        </View>
                        {isSelected && (
                          <Check size={RFValue(12)} color={opt.color} strokeWidth={3} />
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setStatusVisible(false)}
                disabled={updating}
              >
                <Text style={styles.closeModalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 35, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    padding: wp('5%'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: RFValue(13),
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalBody: {
    marginBottom: hp('2.5%'),
    gap: hp('1.5%'),
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  statusOptionActiveActive: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  statusOptionActiveClosed: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.danger,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    flex: 1,
  },
  statusDot: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
  },
  optionTitle: {
    fontSize: RFValue(10.5),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: hp('0.2%'),
    marginLeft: wp('2%'),
  },
  optionDescription: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '400',
    marginLeft: wp('2%'),
  },
  closeModalBtn: {
    paddingVertical: hp('1.3%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: Colors.white,
  },
  closeModalBtnText: {
    fontSize: RFValue(9.5),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});

export default ManagerJobDetailsScreen;
