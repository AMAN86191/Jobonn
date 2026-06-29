import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, StatusBar, View, TouchableOpacity, Modal, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ToastAndroid, Alert, RefreshControl } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import { X, Plus, Edit3, AlertCircle, ChevronRight } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CandidateProfileCompletenessBanner from '../../components/Manager_component/CandidateProfileCompletenessBanner';
import { getCandidateProfileCompleteness } from '../../utils/candidateProfileCompleteness';

import { useDispatch } from 'react-redux';
import { getProfileSlice, updateProfileSlice } from '../../redux/CandidateProfileSlice';

import {
  ProfileHeaderInfo,
  StatsRow,
  ProfessionalDetailsCard,
  ResumeCard,
  SkillsCard,
  ExperienceCard,
  EducationCard,
  ProfileSummaryCard,
  CareerPreferenceCard,
  LanguagesCard,
  PersonalDetailsCard,
} from './CandidateProfileComponents';
import { candidateProfile } from '../../data/jobonnStaticData';
import { normalizeCandidateProfile, buildProfilePayload, formatYear, parseYear, parseDOB } from '../../utils/candidateProfileUtils';
import {
  ProfileInfoForm,
  ProfessionalDetailsForm,
  SkillsForm,
  ExperienceForm,
  EducationForm,
  PersonalDetailsForm,
  SummaryForm,
  CareerPreferenceForm,
  LanguagesForm,
  DocumentsForm
} from '../../components/Candidate_component/CandidateProfileForms';

const CandidateProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  // Dynamic DATA
  const [user, setUser] = useState<any>({
    name: '',
    email: '',
    phone: '',
    candidate_profile: {},
  });

  const fetchProfile = async () => {
    try {
      // 1. Immediately load local cached profile for fast display
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUser(JSON.parse(data));
      } else {
        setUser(candidateProfile);
      }
    } catch (error) {
      console.error('Error fetching cached profile:', error);
    } finally {
      setLoading(false);
    }

    // 2. Fetch fresh profile from the backend
    try {
      const response = await dispatch(getProfileSlice() as any).unwrap();
      console.log('Fetched fresh profile successfully:', response);
      if (response && response.status && response.candidate) {
        const candidate = response.candidate;
        const userObj = candidate.user || {};
        const mappedUser = {
          ...userObj,
          candidate: {
            ...candidate,
            applied_jobs_count: response.applied_jobs_count ?? candidate.applied_jobs_count ?? 0
          },
          role: userObj.role || 'candidate',
          applied_jobs_count: response.applied_jobs_count ?? candidate.applied_jobs_count ?? 0
        };
        // Save to cache
        await AsyncStorage.setItem('userData', JSON.stringify(mappedUser));
        // Update local state
        setUser(mappedUser);
      }
    } catch (apiError) {
      console.error('Error calling get-profile API via Redux:', apiError);
    }
  };

  useEffect(() => {
    fetchProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const { normalizedProfile, normalizedPersonalDetails } = normalizeCandidateProfile(user);

  const isFresher = !user?.candidate?.professional_detail?.experience_level ||
    user?.candidate?.professional_detail?.experience_level?.toLowerCase() === 'fresher' ||
    (user?.candidate?.professional_detail?.exp_years == null && user?.candidate?.professional_detail?.exp_months == null) ||
    (Number(user?.candidate?.professional_detail?.exp_years || 0) === 0 && Number(user?.candidate?.professional_detail?.exp_months || 0) === 0);

  const [editData, setEditData] = useState<any>({});
  const [newSkill, setNewSkill] = useState('');

  const openModal = (section: string) => {
    setActiveSection(section);
    const cand = user?.candidate || {};
    const personal = cand.personal_detail || {};

    const professional = cand.professional_detail || {};
    const career = cand.career_preference || {};
    const educationsList = cand.educations || cand.education || [];
    const firstEdu = educationsList[0] || {};
    const skillsList = cand.skills || [];
    const docsObj = cand.docs || {};

    setEditData({
      // Profile Info
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      job_title: professional.job_title || cand.designation || '',
      current_location: cand.current_location || personal.city || '',

      // Professional Details
      current_company: professional.current_company || '',
      experience_level: professional.experience_level || '',
      exp_years: professional.exp_years !== undefined ? String(professional.exp_years) : '',
      exp_months: professional.exp_months !== undefined ? String(professional.exp_months) : '',
      ctc: professional.ctc !== undefined ? String(professional.ctc) : '',
      expected_salary: career.expected_salary !== undefined ? String(career.expected_salary) : '',
      notice_period: career.notice_period || '',
      preferred_job_types: Array.isArray(career.preferred_job_types)
        ? career.preferred_job_types
        : (typeof career.preferred_job_types === 'string' && career.preferred_job_types.trim()
          ? career.preferred_job_types.split(',').map((s: string) => s.trim())
          : []),
      preferred_location: career.preferred_location || '',
      availability: career.availability || '',
      profile_summery: professional.profile_summery || '',

      // Skills (array of strings)
      skills: skillsList.map((s: any) => typeof s === 'string' ? s : (s.skill || s.skill_name || '')),

      // Experience (array of objects)
      experiences: cand.experiences ? [...cand.experiences] : [],

      // Education (single education keys for API matching completeprofile)
      highest_qualification: firstEdu.highest_qualification || cand.highest_qualification || '',
      institute_name: firstEdu.institute_name || cand.institute_name || '',
      passing_year: (firstEdu.passing_year || cand.passing_year) ? parseYear(String(firstEdu.passing_year || cand.passing_year)) : null,
      percentage_cgpa: firstEdu.percentage_cgpa || cand.percentage_cgpa || '',

      // Personal Details
      dob: personal.dob ? parseDOB(personal.dob) : null,
      gender: personal.gender || '',
      marital_status: personal.marital_status || '',
      city: personal.city || '',
      state: personal.state || '',

      // Languages
      languages: (cand.languages || []).map((l: any) => {
        if (typeof l === 'string') {
          return {
            language_name: l,
            proficiency: '',
            comfortable_in: '',
          };
        }
        return {
          language_name: l.language_name || l.language || l.name || '',
          proficiency: l.proficiency || '',
          comfortable_in: Array.isArray(l.comfortable_in)
            ? l.comfortable_in.join(', ')
            : (l.comfortable_in || ''),
        };
      }),

      // Documents
      profileImage: (docsObj.profile_img || cand.profile_img || cand.profile_image) ? {
        uri: String(docsObj.profile_img || cand.profile_img || cand.profile_image).startsWith('http')
          ? String(docsObj.profile_img || cand.profile_img || cand.profile_image)
          : `https://admin.jobonn.in/storage/${docsObj.profile_img || cand.profile_img || cand.profile_image}`,
        name: 'profile_image.jpg',
        type: 'image/jpeg',
      } : null,
      resume: (docsObj.resume || cand.resume) ? {
        uri: String(docsObj.resume || cand.resume).startsWith('http')
          ? String(docsObj.resume || cand.resume)
          : `https://admin.jobonn.in/storage/${docsObj.resume || cand.resume}`,
        name: String(docsObj.resume || cand.resume).split('/').pop() || 'resume.pdf',
        type: 'application/pdf',
      } : null,
      portfolio: docsObj.portfolio_link || cand.portfolio_link || cand.portfolio || '',
    });
  };

  const closeModal = () => {
    setActiveSection(null);
    setNewSkill('');
  };

  const saveChanges = async () => {
    if (!activeSection) return;
    try {
      setSaving(true);
      const cand = user?.candidate || {};
      let payload = buildProfilePayload(activeSection as string, editData, cand);

      console.log('Dispatching profile update with payload:', payload);

      const res = await dispatch(updateProfileSlice(payload) as any).unwrap();
      console.log("response", res);

      // Fetch fresh profile from backend to update state and storage cache
      await fetchProfile();

      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      closeModal();
    } catch (error: any) {
      console.error('Update failed:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };


  const updateExperience = (index: number, key: string, value: string) => {
    const updatedExp = [...editData.experiences];
    updatedExp[index] = { ...updatedExp[index], [key]: value };
    setEditData({ ...editData, experiences: updatedExp });
  };

  const addExperience = () => {
    setEditData({
      ...editData,
      experiences: [...(editData.experiences || []), { company: '', position: '', startDate: '', endDate: '' }]
    });
  };

  const removeExperience = (index: number) => {
    setEditData({
      ...editData,
      experiences: editData.experiences.filter((_: any, i: number) => i !== index)
    });
  };



  const removeLanguage = (index: number) => {
    setEditData({
      ...editData,
      languages: editData.languages.filter((_: any, i: number) => i !== index)
    });
  };

  const renderModalContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileInfoForm editData={editData} setEditData={setEditData} />;
      case 'professional':
        return <ProfessionalDetailsForm editData={editData} setEditData={setEditData} />;
      case 'skills':
        return <SkillsForm editData={editData} setEditData={setEditData} />;
      case 'experience':
        return <ExperienceForm editData={editData} setEditData={setEditData} updateExperience={updateExperience} addExperience={addExperience} removeExperience={removeExperience} />;
      case 'education':
        return <EducationForm editData={editData} setEditData={setEditData} />;
      case 'personal':
        return <PersonalDetailsForm editData={editData} setEditData={setEditData} />;
      case 'summary':
        return <SummaryForm editData={editData} setEditData={setEditData} />;
      case 'career':
        return <CareerPreferenceForm editData={editData} setEditData={setEditData} />;
      case 'languages':
        return <LanguagesForm editData={editData} setEditData={setEditData} removeLanguage={removeLanguage} />;
      case 'documents':
        return <DocumentsForm editData={editData} setEditData={setEditData} />;
      default:
        return null;
    }
  };

  const modalTitles: any = {
    profile: "Edit Profile Info",
    professional: "Edit Professional Details",
    skills: "Manage Skills",
    experience: "Add/Edit Experience",
    education: "Add/Edit Education",
    personal: "Edit Personal Details",
    summary: "Edit Profile Summary",
    career: "Edit Career Preferences",
    languages: "Manage Languages",
    documents: "Edit Profile & Documents"
  };

  const completeness = getCandidateProfileCompleteness(user || candidateProfile);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <MainManagerHeader
        title='Profile'
        subtitle='manage your profile'
        rightComponent={
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => openModal('profile')}>
              <Edit3 color={Colors.primary} size={RFValue(10)} />
            </TouchableOpacity>
          </View>
        }
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
        >

          {/* Incomplete Profile Banner */}
          <CandidateProfileCompletenessBanner user={user} navigation={navigation} />

          <ProfileHeaderInfo user={user} profile={normalizedProfile} completenessValue={completeness.percentage} onEdit={() => openModal('documents')} />
          <StatsRow appliedJobsCount={user?.candidate?.applied_jobs_count || user?.applied_jobs_count || 0} />
          <ResumeCard user={user} profile={normalizedProfile} onEdit={() => openModal('documents')} />
          <ProfileSummaryCard profile={normalizedProfile} onEdit={() => openModal('summary')} />
          <CareerPreferenceCard profile={normalizedProfile} onEdit={() => openModal('career')} />
          <ProfessionalDetailsCard profile={normalizedProfile} onEdit={() => openModal('professional')} />
          <SkillsCard profile={normalizedProfile} onEdit={() => openModal('skills')} />
          {!isFresher && (
            <ExperienceCard profile={normalizedProfile} onEdit={() => openModal('experience')} />
          )}
          <EducationCard profile={normalizedProfile} onEdit={() => openModal('education')} />
          <LanguagesCard profile={normalizedProfile} onEdit={() => openModal('languages')} />
          <PersonalDetailsCard personalDetails={normalizedPersonalDetails} onEdit={() => openModal('personal')} />
          {/* <RecentActivitySection /> */}

          <View style={{ height: hp('9%') }} />
        </ScrollView>
      )}

      {/* Reusable Edit Modal */}
      <Modal visible={!!activeSection} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} activeOpacity={1} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activeSection ? modalTitles[activeSection] : ''}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                <X size={RFValue(12)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp('4%') }}>
              {renderModalContent()}

              <TouchableOpacity onPress={saveChanges} style={styles.saveBtn} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    padding: wp('2%'),
  },

  // Profile Banner
  profileBanner: {
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
  },
  profileBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
  },
  profileBannerIconBg: {
    backgroundColor: Colors.white,
    padding: wp('1.5%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  profileBannerTextWrap: {
    flex: 1,
  },
  profileBannerTitle: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.warning,
    marginBottom: hp('0.3%'),
  },
  profileBannerSub: {
    fontSize: RFValue(8.5),
    color: Colors.warning,
    fontWeight: '500',
  },

  // Modals
  topActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: wp('1.5%'), marginBottom: hp('0.8%') },
  iconBtn: { backgroundColor: Colors.white, padding: wp('1.5%'), borderRadius: wp('2%'), borderWidth: 1, borderColor: Colors.border },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: wp('5%'), borderTopRightRadius: wp('5%'), padding: wp('3%'), maxHeight: hp('80%') },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('2%') },
  modalTitle: { fontSize: RFValue(12), fontWeight: '700', color: Colors.textPrimary },
  closeBtn: { padding: wp('1%'), backgroundColor: Colors.borderLight, borderRadius: wp('2%') },
  saveBtn: { backgroundColor: Colors.primary, paddingVertical: hp('1.5%'), borderRadius: wp('2.5%'), alignItems: 'center', marginTop: hp('2%') },
  saveBtnText: { fontSize: RFValue(11), fontWeight: '700', color: Colors.white },

  // Edit Skills styles
  addBtn: { backgroundColor: Colors.primary, padding: wp('2.5%'), borderRadius: wp('2%'), justifyContent: 'center', alignItems: 'center' },
  editSkillBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.6%'), borderRadius: wp('1.5%'), borderWidth: 1, borderColor: Colors.primary + '30' },
  editSkillText: { fontSize: RFValue(9), color: Colors.primary, fontWeight: '600' },
});

export default CandidateProfileScreen;
