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

const JOBS_LIST = [
  'Senior React Native Developer',
  'UX/UI Designer',
  'Backend Engineer',
  'Product Manager',
  'Frontend Developer (React)',
];

const CandidateApplicationFullView = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { applicant } = route.params || {};
  const [_status, setStatus] = useState(applicant?.status || 'New');
  const [noteContent, setNoteContent] = useState('');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
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
        const res = await getAppliedCandidateDetail(applicant.candidate_id);
        console.log('getAppliedCandidateDetail response:', res);
        if (res?.status && res?.candidate) {
          const { normalizedProfile, normalizedPersonalDetails } = normalizeCandidateProfile(res.candidate);
          setDetailData({
            ...res.candidate,
            normalizedProfile,
            normalizedPersonalDetails,
            applications: res.applications || []
          });
        }
      } catch (error) {
        console.log('Error fetching candidate detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [applicant?.candidate_id]);

  const isFresher = (exp: string) => {
    if (!exp) return true;
    const lowercaseExp = exp.toLowerCase();
    if (lowercaseExp.includes('fresher')) return true;
    if (lowercaseExp.includes('0 years') || lowercaseExp.includes('0 yrs')) {
      if (lowercaseExp.includes('0 months') || lowercaseExp.includes('0 mos') || !lowercaseExp.includes('month')) {
        return true;
      }
    }
    return false;
  };

  const displayApplicant = useMemo(() => {
    if (!detailData) {
      return {
        ...applicant,
        experience: applicant.experience || '',
        currentCTC: applicant.currentCTC || 'Not Disclosed',
        expectedCTC: applicant.expectedCTC || 'Not Disclosed',
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
      currentCTC: (prof.currentCTC && prof.currentCTC !== 'null') ? (String(prof.currentCTC).toLowerCase().includes('lpa') ? prof.currentCTC : `${prof.currentCTC} LPA`) : (applicant.currentCTC || 'Not Disclosed'),
      expectedCTC: (prof.expectedCTC && prof.expectedCTC !== 'null') ? prof.expectedCTC : (applicant.expectedCTC || 'Not Disclosed'),
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
  console.log('displayApplicant', displayApplicant)
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

  const handleSendInvite = () => {
    if (!selectedJob) {
      Alert.alert('Required', 'Please select a job post.');
      return;
    }
    setInviteModalVisible(false);
    Alert.alert(
      'Success',
      `Invitation sent to ${displayApplicant.name} for the post of ${selectedJob}!`
    );
    setSelectedJob('');
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
  const handleUnlockContact = () => {
    if (contactUnlocked) return;
    setCreditsRemaining(prev => Math.max(prev - contactCredits.costPerUnlock, 0));
    setContactUnlocked(true);
    Alert.alert('Contact unlocked', `${displayApplicant.name}'s mobile, email and WhatsApp details are now visible.`);
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
                <CreditCard size={RFValue(10)} color={Colors.textSecondary} />
                <Text style={styles.creditText}>{creditsRemaining} credits available</Text>
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
              {displayApplicant.summary || ''}
            </Text>
          </RAnimated.View>

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
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, hp('1.5%')) }]}>
        {route.params?.isRecommended ? (
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
              onPress={() => setStatus('Rejected')}
            >
              <XCircle color={Colors.danger} size={RFValue(10)} />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>

            {/* Shortlist Outline Button */}
            <TouchableOpacity
              style={styles.shortlistBtnOutline}
              onPress={() => Alert.alert('Shortlisted', 'Applicant added to shortlist!')}
            >
              <Bookmark color={Colors.textPrimary} size={RFValue(10)} />
              <Text style={styles.shortlistBtnText}>Shortlist</Text>
            </TouchableOpacity>

            {/* Schedule solid purple button */}
            <TouchableOpacity
              style={styles.scheduleSolidBtn}
              onPress={() => setScheduleModalVisible(true)}
            >
              <Calendar color={Colors.white} size={RFValue(10.5)} />
              <Text style={styles.scheduleSolidText}>Schedule Interview</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Schedule Interview Modal component */}
      <ScheduleInterviewModal
        visible={scheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        onConfirm={(_scheduledDate, _scheduledTime, _mode) => {
          setScheduleModalVisible(false);
          setStatus('Shortlisted');
          navigation.navigate('ManagerInterviews');
        }}
      />

      {/* Send Invite Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={inviteModalVisible}
        onRequestClose={() => {
          setInviteModalVisible(false);
          setSelectedJob('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Job Post</Text>
              <TouchableOpacity
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
                  data={JOBS_LIST}
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
                  !selectedJob && { backgroundColor: Colors.border }
                ]}
                disabled={!selectedJob}
                onPress={handleSendInvite}
              >
                <Text style={styles.confirmBtnText}>Send Invite</Text>
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
});

export default CandidateApplicationFullView;
