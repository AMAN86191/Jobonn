import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomInput from '../../../components/inputs/CustomInput';
import CustomButton from '../../../components/buttons/CustomButton';
import DropdownInput from '../../../components/forms/DropdownInput';
import MultiSelectTags from '../../../components/forms/MultiSelectTags';
import DatePickerInput from '../../../components/forms/DatePickerInput';
import UploadCard from '../../../components/forms/UploadCard';
import { Colors } from '../../../theme/Colors';
import { Typography } from '../../../theme/Typography';
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Edit2, Trash2, Plus } from 'lucide-react-native';
import LanguageProficiencyModal, { LanguageData } from '../../../components/forms/LanguageProficiencyModal';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  savePersonalDetailsSlice,
  saveProfessionalInfoSlice,
  saveCareerPreferencesSlice,
  saveEducationSlice,
  saveDocumentsSlice,
} from '../../../redux/CandidateProfileSlice';
import { parseDOB, parseYear } from '../../../utils/candidateProfileUtils';

interface CandidateProfileStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepSave: (data: any, stepIndex: number) => void;
  onAllComplete: () => void;
  onSkipStep: (stepIndex: number) => void;
  saving: boolean;
  totalSteps: number;
  initialData?: any;
}

const formatDate = (date: any) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const formatDateToDDMMYYYY = (date: any) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return '';
  }
};

const mapComfortSkill = (skill: string) => {
  if (skill === 'Reading') return 'Read';
  if (skill === 'Writing') return 'Write';
  if (skill === 'Speaking') return 'Speak';
  return skill;
};

const formatYear = (date: any) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return String(d.getFullYear());
  } catch {
    return String(date);
  }
};

const CandidateProfileSteps: React.FC<CandidateProfileStepsProps> = ({
  currentStep,
  onStepChange,
  onStepSave,
  onAllComplete,
  onSkipStep,
  saving,
  totalSteps,
  initialData,
}) => {
  const dispatch = useDispatch();
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [editingLangIndex, setEditingLangIndex] = useState<number | null>(null);
  const [candidateId, setCandidateId] = useState<number | null>(null);

  const prefillForm = (userObj: any) => {
    if (!userObj) return;
    console.log('[CandidateProfileSteps] Prefilling form with:', userObj);
    const cand = userObj.candidate || userObj || {};
    const personal = cand.personal_detail || {};
    const professional = cand.professional_detail || {};
    const career = cand.career_preference || {};
    const educationsList = cand.educations || cand.education || [];
    const firstEdu = educationsList[0] || {};
    const skillsList = cand.skills || [];
    const docsObj = cand.docs || {};

    const parseComfortableIn = (comfortableIn: any): string[] => {
      if (!comfortableIn) return [];
      const str = Array.isArray(comfortableIn) ? comfortableIn.join(', ') : String(comfortableIn);
      const result: string[] = [];
      if (str.toLowerCase().includes('read')) result.push('Reading');
      if (str.toLowerCase().includes('write')) result.push('Writing');
      if (str.toLowerCase().includes('speak')) result.push('Speaking');
      return result;
    };

    setFormData((prev: any) => ({
      ...prev,
      dob: personal.dob ? parseDOB(personal.dob) : prev.dob,
      gender: personal.gender || prev.gender,
      maritalStatus: personal.marital_status || prev.maritalStatus,
      languages: (cand.languages && cand.languages.length > 0)
        ? cand.languages.map((l: any) => {
          if (typeof l === 'string') {
            return {
              language: l,
              proficiency: '',
              comfortableIn: [],
            };
          }
          return {
            language: l.language_name || l.language || l.name || '',
            proficiency: l.proficiency || '',
            comfortableIn: parseComfortableIn(l.comfortable_in),
          };
        })
        : prev.languages,
      city: personal.city || prev.city,
      state: personal.state || prev.state,
      summary: professional.profile_summery || prev.summary,
      jobTitle: professional.job_title || cand.designation || prev.jobTitle,
      experienceLevel: professional.experience_level || prev.experienceLevel,
      experienceYears: professional.exp_years !== undefined && professional.exp_years !== null && professional.exp_years !== 'null' ? String(professional.exp_years) : prev.experienceYears,
      experienceMonths: professional.exp_months !== undefined && professional.exp_months !== null && professional.exp_months !== 'null' ? String(professional.exp_months) : prev.experienceMonths,
      currentCompany: professional.current_company || prev.currentCompany,
      currentLocation: professional.current_location !== 'null' ? (professional.current_location || prev.currentLocation) : prev.currentLocation,
      currentCTC: professional.ctc !== undefined && professional.ctc !== null && professional.ctc !== 'null' ? String(professional.ctc) : prev.currentCTC,
      skills: (skillsList && skillsList.length > 0)
        ? skillsList.map((s: any) => typeof s === 'string' ? s : (s.skill || s.skill_name || ''))
        : prev.skills,
      noticePeriod: career.notice_period || prev.noticePeriod,
      jobType: (career.preferred_job_types && (Array.isArray(career.preferred_job_types) || typeof career.preferred_job_types === 'string'))
        ? (Array.isArray(career.preferred_job_types)
          ? career.preferred_job_types
          : (typeof career.preferred_job_types === 'string' && career.preferred_job_types.trim()
            ? career.preferred_job_types.split(',').map((s: string) => s.trim())
            : []))
        : prev.jobType,
      expectedSalary: career.expected_salary !== undefined && career.expected_salary !== null && career.expected_salary !== 'null' ? String(career.expected_salary) : prev.expectedSalary,
      preferredLocation: career.preferred_location || prev.preferredLocation,
      preferredShift: career.availability || prev.preferredShift,
      qualification: firstEdu.highest_qualification || cand.highest_qualification || prev.qualification,
      college: firstEdu.institute_name || cand.institute_name || prev.college,
      passingYear: (firstEdu.passing_year || cand.passing_year) ? parseYear(String(firstEdu.passing_year || cand.passing_year)) : prev.passingYear,
      percentage: firstEdu.percentage_cgpa !== undefined && firstEdu.percentage_cgpa !== null && firstEdu.percentage_cgpa !== 'null' ? String(firstEdu.percentage_cgpa) : prev.percentage,
      profileImage: (docsObj.profile_img || cand.profile_img || cand.profile_image) ? {
        uri: String(docsObj.profile_img || cand.profile_img || cand.profile_image).startsWith('http')
          ? String(docsObj.profile_img || cand.profile_img || cand.profile_image)
          : `https://admin.jobonn.in/storage/${docsObj.profile_img || cand.profile_img || cand.profile_image}`,
        name: 'profile_image.jpg',
        type: 'image/jpeg',
      } : prev.profileImage,
      resume: (docsObj.resume || cand.resume) ? {
        uri: String(docsObj.resume || cand.resume).startsWith('http')
          ? String(docsObj.resume || cand.resume)
          : `https://admin.jobonn.in/storage/${docsObj.resume || cand.resume}`,
        name: 'resume.pdf',
        type: 'application/pdf',
      } : prev.resume,
      portfolio: docsObj.portfolio_link || cand.portfolio || prev.portfolio,
    }));
  };

  useEffect(() => {
    if (initialData) {
      prefillForm(initialData);
      const candId = initialData.candidate?.id || initialData.candidate_id || initialData.id;
      if (candId) {
        setCandidateId(Number(candId));
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCandidateIdAndUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          const parsed = JSON.parse(data);
          const candId = parsed.candidate?.id || parsed.candidate_id || parsed.id;
          if (candId) {
            setCandidateId(Number(candId));
            console.log('[CandidateProfileSteps] Loaded candidate_id:', candId);
          }
          if (!initialData) {
            prefillForm(parsed);
          }
        }
      } catch (error) {
        console.error('[CandidateProfileSteps] Error loading candidate_id/userData:', error);
      }
    };
    fetchCandidateIdAndUserData();
  }, [initialData]);

  // Form State
  const [formData, setFormData] = useState<any>({
    dob: null,
    gender: '',
    maritalStatus: '',
    languages: [],
    city: '',
    state: '',
    summary: '',
    jobTitle: '',
    experienceLevel: '',
    experienceYears: '',
    experienceMonths: '',
    currentCompany: '',
    currentLocation: '',
    currentCTC: '',
    skills: [],
    noticePeriod: '',
    jobType: [],
    expectedSalary: '',
    preferredLocation: '',
    preferredShift: '',
    qualification: '',
    college: '',
    passingYear: null,
    percentage: '',
    profileImage: null,
    resume: null,
    portfolio: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [localSaving, setLocalSaving] = useState(false);

  const updateField = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev: any) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep = () => {
    const newErrors: any = {};
    if (currentStep === 0) {
      if (!formData.dob) newErrors.dob = 'Date of Birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
      if (formData.languages.length === 0) newErrors.languages = 'Add at least one language';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
    } else if (currentStep === 1) {
      if (!formData.summary) newErrors.summary = 'Profile summary is required';
      if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required';
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience Level is required';
      if (formData.experienceLevel && formData.experienceLevel !== 'Fresher') {
        if (!formData.experienceYears) newErrors.experienceYears = 'Years is required';
        if (!formData.experienceMonths) newErrors.experienceMonths = 'Months is required';
        if (!formData.currentCompany) newErrors.currentCompany = 'Current Company is required';
        if (!formData.currentLocation) newErrors.currentLocation = 'Current Location is required';
        if (!formData.currentCTC) newErrors.currentCTC = 'Current CTC is required';
      }
    } else if (currentStep === 2) {
      if (formData.skills.length === 0) newErrors.skills = 'At least one skill required';
      if (formData.jobType.length === 0) newErrors.jobType = 'Select at least one job type';
      if (!formData.expectedSalary) newErrors.expectedSalary = 'Expected Salary is required';
      if (!formData.preferredLocation) newErrors.preferredLocation = 'Preferred Location is required';
      if (!formData.preferredShift) newErrors.preferredShift = 'Preferred Shift is required';
      if (!formData.noticePeriod) newErrors.noticePeriod = 'Notice Period is required';
    } else if (currentStep === 3) {
      if (!formData.qualification) newErrors.qualification = 'Highest Qualification is required';
   
      if (!formData.passingYear) newErrors.passingYear = 'Passing Year is required';
      if (!formData.percentage) newErrors.percentage = 'Percentage/CGPA is required';
    } else if (currentStep === 4) {
      if (!formData.resume) newErrors.resume = 'Resume is required';
      if (formData.portfolio) {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (!urlRegex.test(formData.portfolio)) {
          newErrors.portfolio = 'Must be a valid URL';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildStepPayload = (step: number) => {
    const candidateIdStr = candidateId ? String(candidateId) : '';
    switch (step) {
      case 0:
        return {
          candidate_id: candidateIdStr,
          dob: formatDateToDDMMYYYY(formData.dob),
          gender: formData.gender,
          marital_status: formData.maritalStatus,
          city: formData.city,
          state: formData.state,
          languages: (formData.languages || []).map((lang: any) => ({
            language_name: lang.language,
            proficiency: lang.proficiency,
            comfortable_in: (lang.comfortableIn || []).map(mapComfortSkill).join(', '),
          })),
        };
      case 1: {
        const isFresher = formData.experienceLevel === 'Fresher';
        return {
          candidate_id: candidateIdStr,
          profile_summery: formData.summary,
          job_title: formData.jobTitle,
          experience_level: formData.experienceLevel,
          exp_years: isFresher ? 0 : (parseInt(formData.experienceYears, 10) || 0),
          exp_months: isFresher ? 0 : (parseInt(formData.experienceMonths, 10) || 0),
          current_company: isFresher ? null : (formData.currentCompany || null),
          current_location: isFresher ? null : (formData.currentLocation || null),
          ctc: isFresher ? null : (parseFloat(formData.currentCTC) || null),
        };
      }
      case 2:
        return {
          candidate_id: candidateIdStr,
          preferred_location: formData.preferredLocation,
          expected_salary: formData.expectedSalary,
          availability: formData.preferredShift,
          preferred_job_types: formData.jobType,
          notice_period: formData.noticePeriod,
          skills: formData.skills,
        };
      case 3:
        return {
          candidate_id: candidateIdStr,
          highest_qualification: formData.qualification,
          institute_name: formData.college,
          passing_year: formatYear(formData.passingYear),
          percentage_cgpa: formData.percentage,
        };
      case 4: {
        const data = new FormData();
        data.append('candidate_id', String(candidateId || ''));
        data.append('portfolio_link', formData.portfolio || '');
        if (formData.profileImage && formData.profileImage.uri && (formData.profileImage.uri.startsWith('file:') || formData.profileImage.uri.startsWith('content:') || formData.profileImage.uri.startsWith('ph:'))) {
          data.append('profile_img', {
            uri: formData.profileImage.uri,
            name: formData.profileImage.name || 'profile.jpg',
            type: formData.profileImage.type || 'image/jpeg',
          } as any);
        }
        if (formData.resume && formData.resume.uri && (formData.resume.uri.startsWith('file:') || formData.resume.uri.startsWith('content:') || formData.resume.uri.startsWith('ph:'))) {
          data.append('resume', {
            uri: formData.resume.uri,
            name: formData.resume.name || 'resume.pdf',
            type: formData.resume.type || 'application/pdf',
          } as any);
        }
        return data;
      }
      default:
        return {};
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const payload = buildStepPayload(currentStep);
    console.log(`[CandidateProfileSteps] Step ${currentStep} Payload:`, payload);

    try {
      setLocalSaving(true);
      console.log('currentStep', currentStep);

      let action;
      switch (currentStep) {
        case 0:
          action = savePersonalDetailsSlice(payload);
          break;
        case 1:
          action = saveProfessionalInfoSlice(payload);
          break;
        case 2:
          action = saveCareerPreferencesSlice(payload);
          break;
        case 3:
          action = saveEducationSlice(payload);
          break;
        case 4:
          action = saveDocumentsSlice(payload as FormData);
          break;
        default:
          throw new Error('Invalid step');
      }

      console.log(`[CandidateProfileSteps] Dispatching step ${currentStep} Redux action...`);
      const response = await dispatch(action as any).unwrap();
      console.log(`[CandidateProfileSteps] Step ${currentStep} Redux Success:`, response);

      const candObj = response?.user?.candidate || response?.candidate;
      const userObj = response?.user || candObj?.user;

      if (userObj) {
        const userData = {
          ...userObj,
          candidate: candObj,
          profile_completed: currentStep === 4 ? true : false,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('[CandidateProfileSteps] Updated userData in AsyncStorage:', userData);
      }

      onStepSave(payload, currentStep);

      if (currentStep < totalSteps - 1) {
        onStepChange(currentStep + 1);
      } else {
        onAllComplete();
      }
    } catch (error: any) {
      console.error(`[CandidateProfileSteps] Step ${currentStep} Redux Save Failed:`, error);
      const message = error?.message || 'Failed to save progress';
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: message,
      });
    } finally {
      setLocalSaving(false);
    }
  };

  const stepTitles = [
    { title: 'Personal Details', subtitle: 'Tell us about yourself', icon: '👤' },
    { title: 'Professional Info', subtitle: 'Your career background', icon: '💼' },
    { title: 'Career Preferences', subtitle: 'What are you looking for?', icon: '🎯' },
    { title: 'Education', subtitle: 'Your academic background', icon: '🎓' },
    { title: 'Profile & Documents', subtitle: 'Upload your documents', icon: '📄' },
  ];

  const renderStep1 = () => (
    <View>
      <DatePickerInput
        label="Date of Birth"
        placeholder="Select your date of birth"
        value={formData.dob}
        onChange={(val) => updateField('dob', val)}
        error={errors.dob}
      />
      <DropdownInput
        label="Gender"
        placeholder="Select your gender"
        value={formData.gender}
        options={['Male', 'Female', 'Other']}
        onSelect={(val) => updateField('gender', val)}
        error={errors.gender}
      />
      <DropdownInput
        label="Marital Status"
        placeholder="Select"
        value={formData.maritalStatus}
        options={['Single', 'Married', 'Divorced']}
        onSelect={(val) => updateField('maritalStatus', val)}
        error={errors.maritalStatus}
      />

      <View style={{ marginBottom: hp('2%') }}>
        <Text style={{ fontSize: RFValue(10), color: Colors.textSecondary, marginBottom: hp('1%') }}>Languages Known*</Text>
        <View>
          {formData.languages.map((lang: LanguageData, index: number) => (
            <View key={index} style={styles.langCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.langName}>{lang.language}</Text>
                <Text style={styles.langDetail}>{lang.proficiency} • {lang.comfortableIn.join(', ')}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: wp('3%') }}>
                <TouchableOpacity onPress={() => { setEditingLangIndex(index); setIsLangModalVisible(true); }}>
                  <Edit2 size={RFValue(12)} color={Colors.info} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateField('languages', formData.languages.filter((_: any, i: number) => i !== index))}>
                  <Trash2 size={RFValue(12)} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addLangBtn}
            onPress={() => { setEditingLangIndex(null); setIsLangModalVisible(true); }}
          >
            <Plus size={RFValue(11)} color={Colors.textSecondary} style={{ marginRight: wp('1%') }} />
            <Text style={styles.addLangText}>Add Language</Text>
          </TouchableOpacity>
          {errors.languages && <Text style={styles.errorText}>{errors.languages}</Text>}
          <LanguageProficiencyModal
            visible={isLangModalVisible}
            onClose={() => { setIsLangModalVisible(false); setEditingLangIndex(null); }}
            existingLanguages={formData.languages.map((l: any) => l.language)}
            initialData={editingLangIndex !== null ? formData.languages[editingLangIndex] : null}
            onSave={(data) => {
              if (editingLangIndex !== null) {
                const updated = [...formData.languages];
                updated[editingLangIndex] = data;
                updateField('languages', updated);
              } else {
                updateField('languages', [...formData.languages, data]);
              }
            }}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: wp('4%') }}>
        <View style={{ flex: 1 }}>
          <CustomInput
            label="City"
            placeholder="City"
            value={formData.city}
            onChangeText={(val) => updateField('city', val)}
            error={errors.city}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            label="State"
            placeholder="State"
            value={formData.state}
            onChangeText={(val) => updateField('state', val)}
            error={errors.state}
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => {
    const isExperienced = formData.experienceLevel && formData.experienceLevel !== 'Fresher';
    return (
      <View>
        <CustomInput
          label="Profile Summary"
          placeholder="Brief overview of your professional background"
          value={formData.summary}
          onChangeText={(val) => updateField('summary', val)}
          error={errors.summary}
        />
        <CustomInput
          label="Job Title"
          placeholder="Enter your current job role"
          value={formData.jobTitle}
          onChangeText={(val) => updateField('jobTitle', val)}
          error={errors.jobTitle}
        />
        <DropdownInput
          label="Experience Level"
          placeholder="Select experience level"
          value={formData.experienceLevel}
          options={['Fresher', 'Intermediate', 'Senior', 'Executive']}
          onSelect={(val) => updateField('experienceLevel', val)}
          error={errors.experienceLevel}
        />
        {isExperienced && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={{ flexDirection: 'row', gap: wp('4%') }}>
              <View style={{ flex: 1 }}>
                <DropdownInput
                  label="Exp. Years"
                  placeholder="Years"
                  value={formData.experienceYears}
                  options={Array.from({ length: 31 }, (_, i) => String(i))}
                  onSelect={(val) => updateField('experienceYears', val)}
                  error={errors.experienceYears}
                />
              </View>
              <View style={{ flex: 1 }}>
                <DropdownInput
                  label="Exp. Months"
                  placeholder="Months"
                  value={formData.experienceMonths}
                  options={Array.from({ length: 12 }, (_, i) => String(i))}
                  onSelect={(val) => updateField('experienceMonths', val)}
                  error={errors.experienceMonths}
                />
              </View>
            </View>
            <CustomInput
              label="Current Company"
              placeholder="Company Name"
              value={formData.currentCompany}
              onChangeText={(val) => updateField('currentCompany', val)}
              error={errors.currentCompany}
            />
            <CustomInput
              label="Current Location"
              placeholder="e.g. Bangalore"
              value={formData.currentLocation}
              onChangeText={(val) => updateField('currentLocation', val)}
              error={errors.currentLocation}
            />
            <CustomInput
              label="Current CTC (LPA)"
              placeholder="e.g. 8"
              keyboardType="numeric"
              value={formData.currentCTC}
              onChangeText={(val) => updateField('currentCTC', val)}
              error={errors.currentCTC}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  const renderStep3 = () => (
    <View>
      <MultiSelectTags
        label="Skills"
        placeholder="Type skill and press enter"
        tags={formData.skills || []}
        onAddTag={(tag) => updateField('skills', [...(formData.skills || []), tag])}
        onRemoveTag={(tag) => updateField('skills', (formData.skills || []).filter((t: string) => t !== tag))}
        error={errors.skills}
      />
      <MultiSelectTags
        label="Preferred Job Types"
        placeholder="Select job types"
        tags={formData.jobType || []}
        onAddTag={(tag) => updateField('jobType', [...(formData.jobType || []), tag])}
        onRemoveTag={(tag) => updateField('jobType', (formData.jobType || []).filter((t: string) => t !== tag))}
        error={errors.jobType}
        options={['Full-time', 'Part-time', 'Contract', 'Remote']}
      />
      <CustomInput
        label="Preferred Location"
        placeholder="e.g. Remote, Bangalore, Delhi"
        value={formData.preferredLocation}
        onChangeText={(val) => updateField('preferredLocation', val)}
        error={errors.preferredLocation}
      />
      <View style={{ flexDirection: 'row', gap: wp('4%') }}>
        <View style={{ flex: 1 }}>
          <DropdownInput
            label="Preferred Shift"
            placeholder="Select"
            value={formData.preferredShift}
            options={['Day Shift', 'Night Shift', 'Flexible']}
            onSelect={(val) => updateField('preferredShift', val)}
            error={errors.preferredShift}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropdownInput
            label="Availability"
            placeholder="Notice Period"
            value={formData.noticePeriod}
            options={['Immediate', '15 Days', '30 Days', '60 Days', '90 Days']}
            onSelect={(val) => updateField('noticePeriod', val)}
            error={errors.noticePeriod}
          />
        </View>
      </View>
      <CustomInput
        label="Expected Salary (LPA)"
        placeholder="e.g. 10"
        keyboardType="numeric"
        value={formData.expectedSalary}
        onChangeText={(val) => updateField('expectedSalary', val)}
        error={errors.expectedSalary}
      />
    </View>
  );

  const renderStep4 = () => (
    <View>
      <DropdownInput
        label="Highest Qualification"
        placeholder="Select qualification"
        value={formData.qualification}
        options={['B.Tech', 'M.Tech', 'B.Sc', 'BCA', 'MCA', 'Other']}
        onSelect={(val) => updateField('qualification', val)}
        error={errors.qualification}
      />
      <CustomInput
        label="College Name"
        placeholder="Enter your college or university name"
        value={formData.college}
        onChangeText={(val) => updateField('college', val)}
        error={errors.college}
      />
      <DatePickerInput
        label="Passing Year"
        placeholder="Select graduation year"
        value={formData.passingYear}
        onChange={(val) => updateField('passingYear', val)}
        error={errors.passingYear}
      />
      <CustomInput
        label="Percentage/CGPA"
        placeholder="Enter final percentage or CGPA"
        keyboardType="numeric"
        value={formData.percentage}
        onChangeText={(val) => updateField('percentage', val)}
        error={errors.percentage}
      />
    </View>
  );

  const renderStep5 = () => (
    <View>
      <UploadCard
        label="Profile Image"
        type="image"
        value={formData.profileImage}
        onChange={(val) => updateField('profileImage', val)}
        error={errors.profileImage}
        placeholder="Upload your professional photo"
      />
      <UploadCard
        label="Resume (PDF/DOC)"
        type="document"
        value={formData.resume}
        onChange={(val) => updateField('resume', val)}
        error={errors.resume}
        placeholder="Upload your resume"
      />
      <CustomInput
        label="Portfolio Link (Optional)"
        placeholder="https://yourportfolio.com"
        value={formData.portfolio}
        onChangeText={(val) => updateField('portfolio', val)}
        error={errors.portfolio}
        autoCapitalize="none"
      />
    </View>
  );

  const currentTitle = stepTitles[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.container}>
      {/* Step Header */}
      <Animated.View entering={FadeInDown.duration(300)} key={`header-${currentStep}`}>
        <View style={styles.stepHeaderRow}>
          <Text style={styles.stepIcon}>{currentTitle.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>{currentTitle.title}</Text>
            <Text style={styles.stepSubtitle}>{currentTitle.subtitle}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Step Content */}
      <View style={styles.formContainer}>
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
        {currentStep === 4 && renderStep5()}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <CustomButton
          title={isLastStep ? 'Finish Profile ✨' : 'Save & Continue'}
          onPress={handleNext}
          loading={saving || localSaving}
          style={styles.nextBtn}
        />
        <TouchableOpacity style={styles.skipBtn} onPress={() => onSkipStep(currentStep)} activeOpacity={0.7}>
          <Text style={styles.skipBtnText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    backgroundColor: Colors.white,
    padding: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('3%'),
  },
  stepIcon: {
    fontSize: RFValue(18),
  },
  stepTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: hp('0.2%'),
  },
  stepSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  formContainer: { flex: 1 },
  actionRow: {
    marginTop: hp('2%'),
    gap: wp('3%'),
  },
  nextBtn: { width: '100%' },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
  },
  skipBtnText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('3%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  langName: {
    fontSize: RFValue(10),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  langDetail: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    marginTop: hp('0.5%'),
  },
  addLangBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('2%'),
  },
  addLangText: {
    color: Colors.textSecondary,
    fontSize: RFValue(9),
    fontWeight: '600',
  },
  errorText: {
    color: Colors.danger,
    fontSize: RFValue(10),
    marginTop: hp('0.5%'),
  },
});

export default CandidateProfileSteps;
