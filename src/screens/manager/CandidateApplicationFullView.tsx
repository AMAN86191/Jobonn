import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  XCircle,
  Calendar,
  Bookmark,
  Edit3,
  Target,
  FileText,
  Globe,
  User,
  MapPin,
  Lock,
  CreditCard,
  UserCheck,
} from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import { RFValue } from 'react-native-responsive-fontsize';

// Modular Sub-Components
import CandidateProfileCard from '../../components/Manager_component/CandidateProfileCard';
import CandidateActionsBar from '../../components/Manager_component/CandidateActionsBar';
import CandidateWorkExperience from '../../components/Manager_component/CandidateWorkExperience';
import CandidateEducationCard from '../../components/Manager_component/CandidateEducationCard';
import CandidateSkillsCard from '../../components/Manager_component/CandidateSkillsCard';
import ScheduleInterviewModal from '../../components/Manager_component/ScheduleInterviewModal';
import SearchableDropdown from '../../components/forms/SearchableDropdown';
import { contactCredits } from '../../data/jobonnStaticData';
import { getAppliedCandidateDetail } from '../../api/CompanyHomeProvider';
import { normalizeCandidateProfile } from '../../utils/candidateProfileUtils';
import { useDispatch } from 'react-redux';
import { unlockCandidateContactSlice, updateHiringProcessSlice, getRecommendedCandidateDetailSlice, sendJobInviteSlice } from '../../redux/CompanyHomeSlice';
import Toast from 'react-native-toast-message';

const JOBS_LIST = [
  'Senior React Native Developer',
  'UX/UI Designer',
  'Backend Engineer',
  'Product Manager',
  'Frontend Developer (React)',
];

const parseDateString = (dateStr: string) => {
  try {
    const months = {
      january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
      july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
    } as any;
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1].toLowerCase()] || '01';
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.log('Error parsing date string:', e);
  }
  return dateStr;
};

const parseTimeString = (timeStr: string) => {
  try {
    const cleanStr = timeStr.trim();
    const hasAmPm = cleanStr.toLowerCase().includes('am') || cleanStr.toLowerCase().includes('pm');
    if (hasAmPm) {
      const isPm = cleanStr.toLowerCase().includes('pm');
      const timePart = cleanStr.replace(/(am|pm)/i, '').trim();
      let [hours, minutes] = timePart.split(':');
      let hoursNum = parseInt(hours);
      if (isPm && hoursNum < 12) {
        hoursNum += 12;
      }
      if (!isPm && hoursNum === 12) {
        hoursNum = 0;
      }
      return `${String(hoursNum).padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    } else {
      const parts = cleanStr.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
      }
    }
  } catch (e) {
    console.log('Error parsing time string:', e);
  }
  return timeStr;
};

const extractMatchedSkills = (reasons: string[]) => {
  if (!reasons || !Array.isArray(reasons)) return [];
  const skillsSet = new Set<string>();
  reasons.forEach(reason => {
    if (reason.toLowerCase().startsWith('skill match:')) {
      const skillName = reason.substring(12).trim();
      if (skillName) skillsSet.add(skillName);
    } else {
      const match = reason.match(/Skill\s+'([^']+)'/i);
      if (match && match[1]) {
        skillsSet.add(match[1].trim());
      }
    }
  });
  return Array.from(skillsSet);
};

const CandidateApplicationFullView = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { applicant } = route.params || {};
  const [_status, setStatus] = useState(applicant?.status || 'New');
  const isShortlisted = _status?.toLowerCase() === 'shortlisted' || _status?.toLowerCase() === 'interview_schedule' || _status?.toLowerCase() === 'interview';
  const isInterviewScheduled = _status?.toLowerCase() === 'interview_schedule' || _status?.toLowerCase() === 'interview';
  const isHired = _status?.toLowerCase() === 'hired';
  const showHireBtn = isInterviewScheduled || isHired;
  const [noteContent, setNoteContent] = useState('');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleUpdateHiringStatus = async (status: string, extraData?: { type: string; date: string; time: string }) => {
    const candidateId = displayApplicant.candidate_id || displayApplicant.id || applicant?.candidate_id;
    const applicationId = detailData?.applications?.[0]?.id ||
      applicant?.id ||
      applicant?.rawApplication?.id ||
      displayApplicant.id ||
      displayApplicant.rawApplication?.id;

    if (!candidateId || !applicationId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Candidate ID or Application ID not found',
      });
      return;
    }

    try {
      setUpdatingStatus(true);

      const payload: any = { status };
      if (status === 'interview_schedule' && extraData) {
        payload.interview_type = extraData.type.toLowerCase();
        payload.interview_date = extraData.date;
        payload.interview_time = extraData.time;
      }

      console.log('Updating hiring process via slice:', { candidateId, applicationId, payload });
      const response = await dispatch(updateHiringProcessSlice({ candidateId, applicationId, payload }) as any).unwrap();
      console.log('Hiring process update response:', response);

      if (response && (response.status === true || response.status_code === 200 || response.status_code === '200')) {
        setStatus(status);
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `Candidate status updated to ${status === 'interview_schedule' ? 'Interview Scheduled' : status}.`,
        });

        if (status === 'interview_schedule') {
          navigation.navigate('ManagerHome', {
            screen: 'ManagerTabNavigator',
            params: {
              screen: 'ManagerInterviewsTab',
            },
          } as any);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: response?.message || 'Failed to update hiring status',
        });
      }
    } catch (error: any) {
      console.log('Update hiring status error:', error);
      let errorMsg = 'Failed to update status';
      if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object') {
        errorMsg = error.message || error.error || 'Failed to update status';
      }
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMsg,
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [contactUnlocked, setContactUnlocked] = useState(!!applicant?.contactUnlocked);
  const [creditsRemaining, setCreditsRemaining] = useState(contactCredits.remaining);

  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!applicant?.candidate_id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = route.params?.isRecommended
          ? await dispatch(getRecommendedCandidateDetailSlice(applicant.candidate_id) as any).unwrap()
          : await getAppliedCandidateDetail(applicant.candidate_id);
        console.log('Candidate detail response:', res);
        const candidateData = res?.candidate || res?.data || res;
        if (candidateData) {
          const { normalizedProfile, normalizedPersonalDetails } = normalizeCandidateProfile(candidateData);
          setDetailData({
            ...candidateData,
            normalizedProfile,
            normalizedPersonalDetails,
            applications: res.applications || []
          });
          if (res?.is_viewed || res?.candidate?.is_viewed === true) {
            setContactUnlocked(true);
          } else {
            setContactUnlocked(false);
          }
        }
      } catch (error) {
        console.log('Error fetching candidate detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [applicant?.candidate_id, route.params?.isRecommended]);


  const displayApplicant = useMemo(() => {
    const cleanCTC = (val: any) => {
      if (val === undefined || val === null || val === '' || String(val).toLowerCase() === 'null') {
        return 'Not Disclosed';
      }
      const str = String(val).replace(/lpa/gi, '').trim();
      const num = parseFloat(str);
      if (!isNaN(num)) {
        return `${num} LPA`;
      }
      return val;
    };

    if (!detailData) {
      return {
        ...applicant,
        experience: applicant.experience || '',
        currentCTC: cleanCTC(applicant.currentCTC),
        expectedCTC: cleanCTC(applicant.expectedCTC),
        noticePeriod: applicant.noticePeriod || '',
        preferredLocation: applicant.preferredLocation || applicant.location || 'Not Specified',
        jobType: applicant.jobType || applicant.preferred_job_types || 'Not Specified',
        preferredShift: applicant.preferredShift || 'Not Specified',
        skills: [],
        languages: [],
        education: [],
        experiences: [],
        summary: '',
        gender: 'Not Specified',
        dob: 'Not Specified',
        hometown: 'Not Specified',
        maritalStatus: 'Not Specified',
        profile_image: '',
        answers: [],
      };
    }
    const prof = detailData.normalizedProfile || {};
    const personal = detailData.normalizedPersonalDetails || {};
    const apps = detailData.applications || [];
    const answers = apps.length > 0 ? (apps[0].answers || []) : [];

    const displayExp = prof.totalExperience || applicant.experience || 'Fresher';

    return {
      ...applicant,
      name: detailData.user?.name || detailData.name || applicant.name || '',
      role: prof.jobTitle || applicant.role || '',
      experience: displayExp,
      location: prof.currentLocation || applicant.location || '',
      currentCTC: (prof.currentCTC && prof.currentCTC !== 'null') ? cleanCTC(prof.currentCTC) : cleanCTC(applicant.currentCTC),
      expectedCTC: (prof.expectedCTC && prof.expectedCTC !== 'null') ? cleanCTC(prof.expectedCTC) : cleanCTC(applicant.expectedCTC),
      noticePeriod: prof.noticePeriod || applicant.noticePeriod || '',
      preferredLocation: prof.preferredLocation || applicant.preferredLocation || applicant.location || 'Not Specified',
      jobType: prof.jobType || applicant.jobType || applicant.preferred_job_types || 'Not Specified',
      preferredShift: prof.preferredShift || applicant.preferredShift || 'Not Specified',
      skills: prof.skills || [],
      languages: prof.languages || [],
      education: prof.education || [],
      experiences: prof.experiences || [],
      summary: prof.summary || '',
      gender: personal.gender || 'Not Specified',
      dob: personal.date_of_birth || 'Not Specified',
      hometown: personal.current_address || 'Not Specified',
      maritalStatus: personal.status || 'Not Specified',
      profile_image: prof.profile_image || '',
      resume: prof.resume || '',
      answers: answers,
    };
  }, [applicant, detailData]);
  const hometownVal = useMemo(() => {
    if (!detailData?.personal_detail) {
      return displayApplicant.hometown || '-';
    }
    const city = detailData.personal_detail.city || '';
    const state = detailData.personal_detail.state || '';
    if (city && state) {
      return `${city}, ${state}`;
    }
    return city || state || '-';
  }, [detailData, displayApplicant.hometown]);

  const handleSendInvite = async () => {
    if (!selectedJob) {
      Alert.alert('Required', 'Please select a job post.');
      return;
    }

    const candidateId = displayApplicant.candidate_id || displayApplicant.id || applicant?.candidate_id;
    const selectedJobObj = detailData?.matched_jobs?.find(
      (match: any) => match.job_title === selectedJob
    );
    const jobId = selectedJobObj?.job_id || selectedJobObj?.id;

    if (!candidateId || !jobId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Candidate ID or Job ID not found',
      });
      return;
    }

    try {
      setSendingInvite(true);
      const response = await dispatch(
        sendJobInviteSlice({ candidate_id: candidateId, job_id: jobId }) as any
      ).unwrap();
      console.log('Job invite response:', response);

      if (
        response &&
        (response.status === true ||
          response.status_code === 200 ||
          response.status_code === '200' ||
          response.status === 'success')
      ) {
        setInviteModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Invite Sent',
          text2: `Invitation sent to ${displayApplicant.name} for the post of ${selectedJob}!`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invite Failed',
          text2: response?.message || 'Failed to send job invitation',
        });
      }
    } catch (error: any) {
      console.log('Send invite error:', error);
      let errorMsg = 'Failed to send invite';
      if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object') {
        errorMsg = error.message || error.error || 'Failed to send invite';
      }
      Toast.show({
        type: 'error',
        text1: 'Invite Failed',
        text2: errorMsg,
      });
    } finally {
      setSendingInvite(false);
      setSelectedJob('');
    }
  };

  if (!applicant) return null;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <CommanManagerHeader
          navigation={navigation}
          title="Application Details"
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FC' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const displayNoticePeriod = displayApplicant.noticePeriod || '';
  const handleUnlockContact = async () => {
    if (contactUnlocked) return;
    const candidateId = displayApplicant.candidate_id || displayApplicant.id;
    if (!candidateId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Candidate ID not found',
      });
      return;
    }

    try {
      const response = await dispatch(unlockCandidateContactSlice({ candidate_id: candidateId }) as any).unwrap();
      console.log('unlockCandidateContact response:', response);

      if (response && (response.status === true || response.status_code === 200 || response.status_code === '200')) {
        setCreditsRemaining(prev => Math.max(prev - contactCredits.costPerUnlock, 0));
        setContactUnlocked(true);
        // Alert.alert('Contact unlocked', `${displayApplicant.name}'s mobile, email and WhatsApp details are now visible.`);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unlock Failed',
          text2: response?.message || 'Failed to unlock contact',
        });
      }
    } catch (error: any) {
      console.log('Unlock contact error:', error);
      let errorMsg = 'Failed to unlock contact';
      if (typeof error === 'string') {
        errorMsg = error;
      } else if (error && typeof error === 'object') {
        errorMsg = error.message || error.error || 'Failed to unlock contact';
      }
      Toast.show({
        type: 'error',
        text1: 'Unlock Failed',
        text2: errorMsg,
      });
    }
  };

  const resumeUrl = displayApplicant.resume
    ? (displayApplicant.resume.startsWith('http')
      ? displayApplicant.resume
      : `https://admin.jobonn.in/storage/${displayApplicant.resume}`)
    : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <CommanManagerHeader
        navigation={navigation}
        title="Application Details"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Profile Card */}
          <CandidateProfileCard applicant={displayApplicant} />

          {contactUnlocked ? (
            <CandidateActionsBar
              emailAddress={detailData?.user?.email || displayApplicant.emailAddress || ''}
              phoneNumber={detailData?.user?.phone || displayApplicant.phoneNumber || ''}
              whatsappNumber={detailData?.user?.phone || displayApplicant.whatsappNumber || ''}
              resumeUrl={resumeUrl}
            />
          ) : (
            <RAnimated.View entering={FadeInDown.duration(400).delay(180)} style={styles.unlockCard}>
              <View style={styles.unlockHeader}>
                <View style={styles.unlockIcon}>
                  <Lock size={RFValue(12)} color={Colors.primary} />
                </View>
                <View style={styles.unlockCopy}>
                  <Text style={styles.unlockTitle}>Contact details hidden</Text>
                  <Text style={styles.unlockSub}>Resume and profile are visible. Credits are deducted only when contact is unlocked.</Text>
                </View>
              </View>
              <View style={styles.creditRow}>
                {/* <CreditCard size={RFValue(10)} color={Colors.textSecondary} />
                <Text style={styles.creditText}>{creditsRemaining} credits available</Text> */}
                <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlockContact}>
                  <Text style={styles.unlockBtnText}>Unlock Contact</Text>
                </TouchableOpacity>
              </View>
            </RAnimated.View>
          )}

          {/* Profile Summary Card */}
          <RAnimated.View entering={FadeInDown.duration(400).delay(260)} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <FileText size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.sectionCardTitle}>Profile Summary</Text>
              </View>
            </View>
            <Text style={styles.summaryText}>
              {displayApplicant.summary || 'Not Provided'}
            </Text>
          </RAnimated.View>

          {/* Matching Jobs Section Card */}
          {detailData?.matched_jobs && detailData.matched_jobs.length > 0 && (
            <RAnimated.View entering={FadeInDown.duration(400).delay(265)} style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <Target size={RFValue(11)} color={Colors.primary} />
                  <Text style={styles.sectionCardTitle}>Matching Jobs</Text>
                </View>
              </View>
              <View style={styles.matchChipsContainer}>
                {detailData.matched_jobs.map((match: any, index: number) => (
                  <View key={index} style={styles.matchSkillChip}>
                    <Text style={styles.matchSkillChipText}>{match.job_title}</Text>
                  </View>
                ))}
              </View>
            </RAnimated.View>
          )}

          {/* Interview Scheduled Banner */}
          {isInterviewScheduled && (
            <RAnimated.View entering={FadeInDown.duration(400).delay(270)} style={styles.interviewScheduledBanner}>
              <Calendar color="#4F46E5" size={RFValue(12)} />
              <View style={styles.interviewBannerTextWrap}>
                <Text style={styles.interviewBannerTitle}>Interview Already Scheduled</Text>
                <Text style={styles.interviewBannerDesc}>
                  An interview has already been scheduled for this candidate. You can view or manage scheduled interview details from the Interviews tab.
                </Text>
              </View>
            </RAnimated.View>
          )}

          {/* Career Preference Card */}
          <RAnimated.View entering={FadeInDown.duration(400).delay(280)} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Target size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.sectionCardTitle}>Career Preference</Text>
              </View>
            </View>
            <View style={styles.careerGridRow}>
              <View style={styles.careerGridCell}>
                <Text style={styles.detailsGridLabel}>Preferred Location</Text>
                <Text style={styles.detailsGridVal}>{displayApplicant.preferredLocation || displayApplicant.location || '-'}</Text>
              </View>
              <View style={styles.careerGridCell}>
                <Text style={styles.detailsGridLabel}>Job Type</Text>
                <Text style={styles.detailsGridVal}>{displayApplicant.jobType || '-'}</Text>
              </View>
              <View style={styles.careerGridCell}>
                <Text style={styles.detailsGridLabel}>Preferred Shift</Text>
                <Text style={styles.detailsGridVal}>{displayApplicant.preferredShift || '-'}</Text>
              </View>
            </View>
            <View style={[styles.careerGridRow, { marginTop: hp('1.5%') }]}>
              {displayApplicant.experience?.toLowerCase() !== 'fresher' ? (
                <View style={styles.careerGridCell}>
                  <Text style={styles.detailsGridLabel}>Expected CTC</Text>
                  <Text style={styles.detailsGridVal}>{displayApplicant.expectedCTC || '-'}</Text>
                </View>
              ) : (
                <View style={styles.careerGridCell} />
              )}
              <View style={styles.careerGridCell}>
                <Text style={styles.detailsGridLabel}>Availability</Text>
                <Text style={styles.detailsGridVal}>{displayNoticePeriod}</Text>
              </View>
              <View style={styles.careerGridCell} />
            </View>
          </RAnimated.View>

          {/* Key Skills Section Card */}
          <CandidateSkillsCard skills={displayApplicant.skills.length > 0 ? displayApplicant.skills : undefined} />

          {/* Work Experience Section Card */}
          <CandidateWorkExperience experiences={displayApplicant.experiences} />

          {/* Education Section Card */}
          <CandidateEducationCard educations={displayApplicant.education} />

          {/* Languages Card */}
          <RAnimated.View entering={FadeInDown.duration(400).delay(300)} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Globe size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.sectionCardTitle}>Languages</Text>
              </View>
            </View>
            <View style={styles.languageContainer}>
              {displayApplicant.languages && displayApplicant.languages.length > 0 ? (
                displayApplicant.languages.map((lang: any, i: number) => (
                  <View key={i} style={styles.languageBadge}>
                    <Text style={styles.languageText}>
                      {typeof lang === 'string' ? lang : `${lang.name || lang.language_name} (${lang.level || lang.proficiency})`}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.languageText}>English (Professional), Hindi (Native)</Text>
              )}
            </View>
          </RAnimated.View>

          {/* Personal Details Card */}
          <RAnimated.View entering={FadeInDown.duration(400).delay(320)} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <User size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.sectionCardTitle}>Personal Details</Text>
              </View>
            </View>
            <View style={styles.detailsGridRow}>
              <View style={styles.detailsGridCell}>
                <View style={styles.iconLabelRow}>
                  <User size={RFValue(8.5)} color={Colors.textSecondary} />
                  <Text style={styles.detailsGridLabelIcon}>Gender</Text>
                  <Text style={styles.detailsGridVal}>{displayApplicant.gender || '-'}</Text>
                </View>
              </View>
              <View style={styles.detailsGridCell}>
                <View style={styles.iconLabelRow}>
                  <Calendar size={RFValue(8.5)} color={Colors.textSecondary} />
                  <Text style={styles.detailsGridLabelIcon}>Date of Birth</Text>
                  <Text style={styles.detailsGridVal}>{displayApplicant.dob || '-'}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.detailsGridRow, { marginTop: hp('1.5%') }]}>
              <View style={styles.detailsGridCell}>
                <View style={styles.iconLabelRow}>
                  <MapPin size={RFValue(8.5)} color={Colors.textSecondary} />
                  <Text style={styles.detailsGridLabelIcon}>Hometown</Text>
                  <Text style={styles.detailsGridVal}>{hometownVal || '-'}</Text>
                </View>
              </View>
              <View style={styles.detailsGridCell}>
                <View style={styles.iconLabelRow}>
                  <User size={RFValue(8.5)} color={Colors.textSecondary} />
                  <Text style={styles.detailsGridLabelIcon}>Marital Status</Text>
                  <Text style={styles.detailsGridVal}>{displayApplicant.maritalStatus || '-'}</Text>
                </View>
              </View>
            </View>
          </RAnimated.View>

          {/* Screening Questions Card */}
          {displayApplicant.answers && displayApplicant.answers.length > 0 && (
            <RAnimated.View entering={FadeInDown.duration(400).delay(345)} style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionHeaderLeft}>
                  <FileText size={RFValue(11)} color={Colors.primary} />
                  <Text style={styles.sectionCardTitle}>Screening Questions</Text>
                </View>
              </View>
              <View style={{ gap: hp('1.5%') }}>
                {displayApplicant.answers.map((ans: any, index: number) => (
                  <View key={index} style={styles.qaContainer}>
                    <Text style={styles.questionText}>
                      Q{index + 1}: {ans.question?.question || 'Question'}
                    </Text>
                    <Text style={styles.answerText}>
                      Ans: {ans.answer || 'No answer provided'}
                    </Text>
                  </View>
                ))}
              </View>
            </RAnimated.View>
          )}

          {/* Internal Manager Notes Input */}
          <RAnimated.View
            entering={FadeInDown.duration(400).delay(350)}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Edit3 size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.sectionCardTitle}>Recruiter Notes</Text>
              </View>
            </View>

            <View style={styles.notesContainer}>
              <TextInput
                style={styles.noteContentInput}
                placeholder="Write your internal recruitment feedback here..."
                placeholderTextColor={Colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={noteContent}
                onChangeText={setNoteContent}
              />
              <TouchableOpacity
                style={styles.saveNoteBtn}
                onPress={() => Alert.alert('Success', 'Internal notes saved successfully!')}
              >
                <Text style={styles.saveNoteText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </RAnimated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Tri-Button Action Footer or Send Invite Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, hp('5%')) }]}>
        {_status?.toLowerCase() === 'rejected' ? (
          <View style={styles.rejectedMessageContainer}>
            <XCircle color={Colors.danger} size={RFValue(12)} />
            <Text style={styles.rejectedMessageText}>This candidate has been rejected</Text>
          </View>
        ) : isHired ? (
          <View style={styles.hiredMessageContainer}>
            <UserCheck color={Colors.success} size={RFValue(12)} />
            <Text style={styles.hiredMessageText}>This candidate has been hired</Text>
          </View>
        ) : route.params?.isRecommended ? (
          <TouchableOpacity
            style={styles.sendInviteBtn}
            onPress={() => {
              setInviteModalVisible(true);
            }}
          >
            <Text style={styles.sendInviteText}>Send Invite</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.footerActionRow}>
            {/* Reject Outline Button */}
            <TouchableOpacity
              style={styles.rejectBtnOutline}
              onPress={() => handleUpdateHiringStatus('rejected')}
              disabled={updatingStatus}
            >
              <XCircle color={Colors.danger} size={RFValue(10)} />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>

            {showHireBtn ? (
              /* Hire Button */
              <TouchableOpacity
                style={[
                  styles.shortlistBtnOutline,
                  isHired && { borderColor: Colors.success, backgroundColor: Colors.success + '10' }
                ]}
                onPress={() => handleUpdateHiringStatus('hired')}
                disabled={updatingStatus || isHired}
              >
                {updatingStatus ? (
                  <ActivityIndicator size="small" color={isHired ? Colors.success : Colors.textPrimary} />
                ) : (
                  <>
                    <UserCheck color={isHired ? Colors.success : Colors.textPrimary} size={RFValue(10)} />
                    <Text style={[styles.shortlistBtnText, isHired && { color: Colors.success }]}>
                      {isHired ? 'Hired' : 'Hire'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              /* Shortlist Outline Button */
              <TouchableOpacity
                style={[
                  styles.shortlistBtnOutline,
                  isShortlisted && { borderColor: Colors.success, backgroundColor: Colors.success + '10' }
                ]}
                onPress={() => handleUpdateHiringStatus('shortlisted')}
                disabled={updatingStatus || isShortlisted}
              >
                {updatingStatus ? (
                  <ActivityIndicator size="small" color={isShortlisted ? Colors.success : Colors.textPrimary} />
                ) : (
                  <>
                    <Bookmark color={isShortlisted ? Colors.success : Colors.textPrimary} size={RFValue(10)} />
                    <Text style={[styles.shortlistBtnText, isShortlisted && { color: Colors.success }]}>
                      {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Schedule / Reschedule solid purple button */}
            <TouchableOpacity
              style={styles.scheduleSolidBtn}
              onPress={() => setScheduleModalVisible(true)}
              disabled={updatingStatus}
            >
              <Calendar color={Colors.white} size={RFValue(10.5)} />
              <Text style={styles.scheduleSolidText}>
                {isInterviewScheduled ? 'Reschedule Interview' : 'Schedule Interview'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Schedule Interview Modal component */}
      <ScheduleInterviewModal
        visible={scheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        onConfirm={(scheduledDate, scheduledTime, mode) => {
          setScheduleModalVisible(false);
          const formattedDate = parseDateString(scheduledDate);
          const formattedTime = parseTimeString(scheduledTime);
          handleUpdateHiringStatus('interview_schedule', {
            type: mode,
            date: formattedDate,
            time: formattedTime
          });
        }}
      />

      {/* Send Invite Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={inviteModalVisible}
        onRequestClose={() => {
          if (!sendingInvite) {
            setInviteModalVisible(false);
            setSelectedJob('');
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Job Post</Text>
              <TouchableOpacity
                disabled={sendingInvite}
                onPress={() => {
                  setInviteModalVisible(false);
                  setSelectedJob('');
                }}
              >
                <XCircle size={RFValue(14)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>
                Select the position you want to invite {applicant.name} for:
              </Text>
              <View style={{ zIndex: 10, elevation: 10, marginVertical: hp('1.5%') }}>
                <SearchableDropdown
                  data={detailData?.matched_jobs?.map((match: any) => match.job_title).filter(Boolean) || []}
                  placeholder="Select a Job Post"
                  value={selectedJob}
                  onSelect={(val) => setSelectedJob(val)}
                />
              </View>

              <View style={styles.modalInfoBox}>
                <Target size={RFValue(11)} color={Colors.primary} />
                <Text style={styles.modalInfoText}>
                  An invitation will be sent to apply for this job.
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                disabled={sendingInvite}
                onPress={() => {
                  setInviteModalVisible(false);
                  setSelectedJob('');
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  (!selectedJob || sendingInvite) && { backgroundColor: Colors.border }
                ]}
                disabled={!selectedJob || sendingInvite}
                onPress={handleSendInvite}
              >
                {sendingInvite ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.confirmBtnText}>Send Invite</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FC' },
  content: { paddingHorizontal: wp('3.5%'), paddingTop: hp('1%') },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('3.5%'),
    marginBottom: hp('1.2%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  sectionCardTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unlockCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '25',
    padding: wp('3.5%'),
    marginBottom: hp('1.2%'),
  },
  unlockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp('3%'),
    marginBottom: hp('1.2%'),
  },
  unlockIcon: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockCopy: {
    flex: 1,
  },
  unlockTitle: {
    fontSize: RFValue(9.5),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  unlockSub: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.3%'),
    lineHeight: RFValue(11),
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: wp('1.5%'),
  },
  creditText: {
    flex: 1,
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  unlockBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
  },
  unlockBtnText: {
    color: Colors.white,
    fontSize: RFValue(8.5),
    fontWeight: '800',
  },

  notesContainer: {
    gap: hp('1%'),
  },
  noteTitleInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    fontSize: RFValue(9.2),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  noteContentInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.2%'),
    fontSize: RFValue(8.8),
    color: Colors.textPrimary,
    minHeight: hp('10%'),
  },
  saveNoteBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 6,
    marginTop: hp('0.4%'),
  },
  saveNoteText: {
    color: Colors.white,
    fontSize: RFValue(8.5),
    fontWeight: '800',
  },

  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp('3.5%'),
    paddingTop: hp('1.2%'),
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: hp('0.3%'),
  },
  sendInviteBtn: {
    backgroundColor: Colors.primary,
    height: hp('4.8%'),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  sendInviteText: {
    color: Colors.white,
    fontSize: RFValue(9.5),
    fontWeight: '800',
  },
  footerActionRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
    alignItems: 'center',
  },
  rejectBtnOutline: {
    width: wp('22%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1%'),
    backgroundColor: Colors.white,
  },
  rejectBtnText: {
    fontSize: RFValue(9.2),
    color: Colors.danger,
    fontWeight: '800',
  },
  shortlistBtnOutline: {
    width: wp('24%'),
    height: hp('4%'),
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1.5%'),
    backgroundColor: Colors.white,
  },
  shortlistBtnText: {
    fontSize: RFValue(9.2),
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  scheduleSolidBtn: {
    flex: 1,
    height: hp('4%'),
    backgroundColor: Colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('1.5%'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleSolidText: {
    fontSize: RFValue(9.2),
    color: Colors.white,
    fontWeight: '800',
  },
  summaryText: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    lineHeight: RFValue(12),
    fontWeight: '500',
    marginTop: hp('0.5%'),
    textAlign: "justify"
  },
  detailsGridRow: {
    flexDirection: 'row',
  },
  detailsGridCell: {
    flex: 1,
  },
  careerGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  careerGridCell: {
    width: wp('26%'),
  },
  detailsGridLabel: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: hp('0.2%'),
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    marginBottom: hp('0.2%'),
  },
  detailsGridLabelIcon: {
    fontSize: RFValue(7.5),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailsGridVal: {
    fontSize: RFValue(8.5),
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginTop: hp('0.5%'),
  },
  languageBadge: {
    borderRadius: 6,
  },
  languageText: {
    fontSize: RFValue(8),
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
  },
  modalLabel: {
    fontSize: RFValue(9.2),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.8%'),
  },
  modalInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    backgroundColor: Colors.primaryLight || '#EEF1FF',
    padding: wp('3%'),
    borderRadius: 10,
    marginTop: hp('2%'),
  },
  modalInfoText: {
    fontSize: RFValue(8.2),
    color: Colors.primary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp('1.3%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: {
    fontSize: RFValue(9.2),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: hp('1.3%'),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  confirmBtnText: {
    fontSize: RFValue(9.2),
    color: Colors.white,
    fontWeight: '800',
  },
  qaContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questionText: {
    fontSize: RFValue(9),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
  },
  answerText: {
    fontSize: RFValue(8.5),
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: RFValue(11.5),
  },
  rejectedMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: hp('1.2%'),
    width: '100%',
    gap: wp('2%'),
  },
  rejectedMessageText: {
    color: '#B91C1C',
    fontSize: RFValue(10.5),
    fontWeight: '700',
  },
  interviewScheduledBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    padding: wp('3.5%'),
    marginBottom: hp('1.2%'),
    gap: wp('3%'),
  },
  interviewBannerTextWrap: {
    flex: 1,
  },
  interviewBannerTitle: {
    fontSize: RFValue(10.5),
    fontWeight: '800',
    color: '#3730A3',
    marginBottom: hp('0.3%'),
  },
  interviewBannerDesc: {
    fontSize: RFValue(8.8),
    color: '#4338CA',
    fontWeight: '500',
    lineHeight: hp('1.8%'),
  },
  hiredMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingVertical: hp('1.2%'),
    width: '100%',
    gap: wp('2%'),
  },
  hiredMessageText: {
    color: '#047857',
    fontSize: RFValue(10.5),
    fontWeight: '700',
  },
  matchItemContainer: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: wp('3.5%'),
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: hp('1%'),
  },
  matchHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  matchJobTitle: {
    fontSize: RFValue(10.5),
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: wp('2%'),
  },
  matchScoreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 12,
  },
  matchScoreText: {
    color: Colors.white,
    fontSize: RFValue(8),
    fontWeight: '700',
  },
  matchReasonsList: {
    gap: hp('0.6%'),
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  reasonBullet: {
    width: wp('1.2%'),
    height: wp('1.2%'),
    borderRadius: wp('0.6%'),
    backgroundColor: Colors.primary,
  },
  reasonText: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    fontWeight: '500',
    lineHeight: RFValue(12),
  },
  matchChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('1.5%'),
    marginTop: hp('0.6%'),
    marginBottom: hp('1%'),
  },
  matchSkillChip: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 6,
    paddingHorizontal: wp('2.2%'),
    paddingVertical: hp('0.3%'),
  },
  matchSkillChipText: {
    fontSize: RFValue(8),
    fontWeight: '700',
    color: '#4F46E5',
  },
});

export default CandidateApplicationFullView;
