import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, StatusBar, View, TouchableOpacity, Modal, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import {  X, Plus, Edit3, AlertCircle, ChevronRight } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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

const CustomInput = ({ label, value, onChangeText, placeholder }: any) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textTertiary}
    />
  </View>
);

const CandidateProfileScreen = ({ navigation }: any) => {

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dynamic DATA
  const [user, setUser] = useState<any>({
    name: '',
    email: '',
    phone: '',
    candidate_profile: {},
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // const res = await GetUser({});
      // if (res && res.user) {
      //   setUser(res.user);
      // }

      setUser(candidateProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      ToastAndroid.show('Failed to load profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const profile = user?.candidate_profile || {};

  const [editData, setEditData] = useState<any>({});
  const [newSkill, setNewSkill] = useState('');

  const openModal = (section: string) => {
    setActiveSection(section);
    setEditData({
      ...user.candidate_profile,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.PersonalDetails?.date_of_birth || '',
      gender: user.PersonalDetails?.gender || '',
      maritalStatus: user.PersonalDetails?.status || '',
      hometown: user.PersonalDetails?.current_address || '',
      work_experience: user.candidate_profile?.work_experience ? [...user.candidate_profile.work_experience] : [],
      education: user.candidate_profile?.education ? [...user.candidate_profile.education] : [],
      skills: user.candidate_profile?.skills ? [...user.candidate_profile.skills] : []
    });
  };

  const closeModal = () => {
    setActiveSection(null);
    setNewSkill('');
  };

  const saveChanges = async () => {
    try {
      setSaving(true);

      setUser({
        ...user,
        name: editData.name || user.name,
        email: editData.email || user.email,
        phone: editData.phone || user.phone,
        PersonalDetails: {
          ...user.PersonalDetails,
          date_of_birth: editData.dateOfBirth,
          gender: editData.gender,
          status: editData.maritalStatus,
          current_address: editData.hometown,
        },
        candidate_profile: {
          ...user.candidate_profile,
          ...editData,
        }
      });
      ToastAndroid.show('Progress saved! (Mock)', ToastAndroid.SHORT);
      closeModal();
    } catch (error: any) {
      console.error('Update failed:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditData({
      ...editData,
      skills: editData.skills.filter((s: string) => s !== skillToRemove)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const updateExperience = (index: number, key: string, value: string) => {
    const updatedExp = [...editData.work_experience];
    updatedExp[index] = { ...updatedExp[index], [key]: value };
    setEditData({ ...editData, work_experience: updatedExp });
  };

  const addExperience = () => {
    setEditData({
      ...editData,
      work_experience: [...(editData.work_experience || []), { company: '', position: '', startDate: '', endDate: '' }]
    });
  };

  const removeExperience = (index: number) => {
    setEditData({
      ...editData,
      work_experience: editData.work_experience.filter((_: any, i: number) => i !== index)
    });
  };

  const updateEducation = (index: number, key: string, value: string) => {
    const updatedEdu = [...editData.education];
    updatedEdu[index] = { ...updatedEdu[index], [key]: value };
    setEditData({ ...editData, education: updatedEdu });
  };

  const addEducation = () => {
    setEditData({
      ...editData,
      education: [...(editData.education || []), { degree: '', school: '', endDate: '' }]
    });
  };

  const removeEducation = (index: number) => {
    setEditData({
      ...editData,
      education: editData.education.filter((_: any, i: number) => i !== index)
    });
  };

  const renderModalContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            <CustomInput label="Full Name" value={editData.name} onChangeText={(text: string) => setEditData({ ...editData, name: text })} placeholder="Enter name" />
            <CustomInput label="Job Title" value={editData.jobTitle} onChangeText={(text: string) => setEditData({ ...editData, jobTitle: text })} placeholder="Enter job title" />
            <CustomInput label="Location" value={editData.currentLocation} onChangeText={(text: string) => setEditData({ ...editData, currentLocation: text })} placeholder="Enter location" />
            <CustomInput label="Email" value={editData.email} onChangeText={(text: string) => setEditData({ ...editData, email: text })} placeholder="Enter email" />
            <CustomInput label="Phone" value={editData.phone} onChangeText={(text: string) => setEditData({ ...editData, phone: text })} placeholder="Enter phone" />
          </>
        );
      case 'professional':
        return (
          <>
            <CustomInput label="Current Company" value={editData.currentCompany} onChangeText={(text: string) => setEditData({ ...editData, currentCompany: text })} placeholder="Enter current company" />
            <CustomInput label="Total Experience" value={editData.totalExperience} onChangeText={(text: string) => setEditData({ ...editData, totalExperience: text })} placeholder="e.g. 2 Years" />
            <CustomInput label="Current CTC" value={editData.currentCTC} onChangeText={(text: string) => setEditData({ ...editData, currentCTC: text })} placeholder="e.g. ₹8 LPA" />
            <CustomInput label="Expected Salary" value={editData.expectedSalary} onChangeText={(text: string) => setEditData({ ...editData, expectedSalary: text })} placeholder="e.g. ₹12 LPA" />
            <CustomInput label="Notice Period" value={editData.noticePeriod} onChangeText={(text: string) => setEditData({ ...editData, noticePeriod: text })} placeholder="e.g. 30 Days" />
            <CustomInput label="Preferred Job Type" value={editData.jobType} onChangeText={(text: string) => setEditData({ ...editData, jobType: text })} placeholder="e.g. Full-time, Remote" />
            <CustomInput label="Current Location" value={editData.currentLocation} onChangeText={(text: string) => setEditData({ ...editData, currentLocation: text })} placeholder="e.g. Jaipur" />
          </>
        );
      case 'skills':
        return (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp('2%') }}>
              <View style={{ flex: 1, marginRight: wp('2%') }}>
                <TextInput
                  style={styles.input}
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Add a new skill"
                  placeholderTextColor={Colors.textTertiary}
                  onSubmitEditing={addSkill}
                />
              </View>
              <TouchableOpacity onPress={addSkill} style={styles.addBtn}>
                <Plus size={RFValue(12)} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: wp('2%') }}>
              {(editData.skills || []).map((skill: string, idx: number) => (
                <View key={idx} style={styles.editSkillBadge}>
                  <Text style={styles.editSkillText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)} style={{ marginLeft: wp('1%') }}>
                    <X size={RFValue(8)} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        );
      case 'experience':
        return (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('1.5%') }}>
              <Text style={{ fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary }}>Work Experience</Text>
              <TouchableOpacity onPress={addExperience} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: wp('2%'), paddingVertical: hp('0.5%'), borderRadius: 6 }}>
                <Plus size={RFValue(9)} color={Colors.white} />
                <Text style={{ color: Colors.white, fontSize: RFValue(9), marginLeft: wp('1%'), fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>

            {(editData.work_experience || []).map((exp: any, index: number) => (
              <View key={index} style={{ backgroundColor: '#F9FAFB', padding: wp('3%'), borderRadius: 12, marginBottom: hp('1.5%'), borderWidth: 1, borderColor: '#E5E7EB' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') }}>
                  <Text style={{ fontSize: RFValue(9.5), fontWeight: '700', color: Colors.textSecondary }}>Experience #{index + 1}</Text>
                  <TouchableOpacity onPress={() => removeExperience(index)}>
                    <Text style={{ color: Colors.danger, fontSize: RFValue(9), fontWeight: '600' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <CustomInput label="Job Title" value={exp.position} onChangeText={(text: string) => updateExperience(index, 'position', text)} placeholder="Enter job title" />
                <CustomInput label="Company Name" value={exp.company} onChangeText={(text: string) => updateExperience(index, 'company', text)} placeholder="Enter company name" />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, marginRight: wp('1.5%') }}>
                    <CustomInput label="Start Date" value={exp.startDate} onChangeText={(text: string) => updateExperience(index, 'startDate', text)} placeholder="e.g. 2020" />
                  </View>
                  <View style={{ flex: 1, marginLeft: wp('1.5%') }}>
                    <CustomInput label="End Date" value={exp.endDate} onChangeText={(text: string) => updateExperience(index, 'endDate', text)} placeholder="e.g. Present" />
                  </View>
                </View>
              </View>
            ))}
          </>
        );
      case 'education':
        return (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('1.5%') }}>
              <Text style={{ fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary }}>Education</Text>
              <TouchableOpacity onPress={addEducation} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: wp('2%'), paddingVertical: hp('0.5%'), borderRadius: 6 }}>
                <Plus size={RFValue(9)} color={Colors.white} />
                <Text style={{ color: Colors.white, fontSize: RFValue(9), marginLeft: wp('1%'), fontWeight: '600' }}>Add</Text>
              </TouchableOpacity>
            </View>

            {(editData.education || []).map((edu: any, index: number) => (
              <View key={index} style={{ backgroundColor: '#F9FAFB', padding: wp('3%'), borderRadius: 12, marginBottom: hp('1.5%'), borderWidth: 1, borderColor: '#E5E7EB' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp('1%') }}>
                  <Text style={{ fontSize: RFValue(9.5), fontWeight: '700', color: Colors.textSecondary }}>Education #{index + 1}</Text>
                  <TouchableOpacity onPress={() => removeEducation(index)}>
                    <Text style={{ color: Colors.danger, fontSize: RFValue(9), fontWeight: '600' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <CustomInput label="Degree / Course" value={edu.degree} onChangeText={(text: string) => updateEducation(index, 'degree', text)} placeholder="e.g. BCA in Computer Science" />
                <CustomInput label="Institution" value={edu.school} onChangeText={(text: string) => updateEducation(index, 'school', text)} placeholder="e.g. Rajasthan University" />
                <CustomInput label="Passing Year" value={edu.endDate} onChangeText={(text: string) => updateEducation(index, 'endDate', text)} placeholder="e.g. 2024" />
              </View>
            ))}
          </>
        );
      case 'personal':
        return (
          <>
            <CustomInput label="Date of Birth" value={editData.dateOfBirth} onChangeText={(text: string) => setEditData({ ...editData, dateOfBirth: text })} placeholder="e.g. 01-01-2000" />
            <CustomInput label="Gender" value={editData.gender} onChangeText={(text: string) => setEditData({ ...editData, gender: text })} placeholder="e.g. Male" />
            <CustomInput label="Marital Status" value={editData.maritalStatus} onChangeText={(text: string) => setEditData({ ...editData, maritalStatus: text })} placeholder="e.g. Single" />
            <CustomInput label="Home Town" value={editData.hometown} onChangeText={(text: string) => setEditData({ ...editData, hometown: text })} placeholder="e.g. Jaipur" />
          </>
        );
      default:
        return null;
    }
  };

  const modalTitles: any = {
    profile: "Edit Profile Info",
    professional: "Edit Professional Details",
    skills: "Manage Skills",
    experience: "Add/Edit Experience",
    education: "Add/Edit Education"
  };

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Incomplete Profile Banner */}
          {user && !user.profile_completed && (
            <TouchableOpacity
              style={styles.profileBanner}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CompleteProfile', { role: 'candidate' })}
            >
              <View style={styles.profileBannerContent}>
                <View style={styles.profileBannerIconBg}>
                  <AlertCircle size={RFValue(12)} color={Colors.warning} />
                </View>
                <View style={styles.profileBannerTextWrap}>
                  <Text style={styles.profileBannerTitle}>Complete Your Profile</Text>
                  <Text style={styles.profileBannerSub}>A complete profile helps you stand out to recruiters.</Text>
                </View>
                <ChevronRight size={RFValue(12)} color={Colors.warning} />
              </View>
            </TouchableOpacity>
          )}

          <ProfileHeaderInfo user={user} profile={profile} onEdit={() => openModal('profile')} />
          <StatsRow />
          <ResumeCard />
          <ProfileSummaryCard profile={profile} />
          <CareerPreferenceCard profile={profile} />
          <ProfessionalDetailsCard profile={profile} onEdit={() => openModal('professional')} />
          <SkillsCard profile={profile} onEdit={() => openModal('skills')} />
          <ExperienceCard profile={profile} onEdit={() => openModal('experience')} />
          <EducationCard profile={profile} onEdit={() => openModal('education')} />
          <LanguagesCard profile={profile} />
          <PersonalDetailsCard personalDetails={user?.PersonalDetails} onEdit={() => openModal('personal')} />
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

  // Input styles
  inputWrap: { marginBottom: hp('1.5%') },
  inputLabel: { fontSize: RFValue(9), color: Colors.textSecondary, marginBottom: hp('0.5%'), fontWeight: '600' },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: wp('2%'), paddingHorizontal: wp('3%'), paddingVertical: hp('1%'), fontSize: RFValue(10), color: Colors.textPrimary, backgroundColor: Colors.white },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: wp('5%'), borderTopRightRadius: wp('5%'), padding: wp('4%'), maxHeight: hp('80%') },
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
