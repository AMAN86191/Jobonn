import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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

interface CandidateProfileStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepSave: (data: any, stepIndex: number) => void;
  onAllComplete: () => void;
  onSkipStep: (stepIndex: number) => void;
  saving: boolean;
  totalSteps: number;
}

// Validation Schemas per step
const step1Schema = yup.object().shape({
  dob: yup.date().required('Date of Birth is required').nullable(),
  gender: yup.string().required('Gender is required'),
  maritalStatus: yup.string().required('Marital Status is required'),
  languages: yup.array().of(
    yup.object().shape({
      language: yup.string().required(),
      proficiency: yup.string().required(),
      comfortableIn: yup.array().of(yup.string()).min(1),
    })
  ).min(1, 'Add at least one language'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
});

const step2Schema = yup.object().shape({
  summary: yup.string().required('Profile summary is required'),
  jobTitle: yup.string().required('Job Title is required'),
  experienceLevel: yup.string().required('Experience Level is required'),
  experienceYears: yup.string().when('experienceLevel', {
    is: (val: string) => val && val !== 'Fresher',
    then: (schema) => schema.required('Years is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  experienceMonths: yup.string().when('experienceLevel', {
    is: (val: string) => val && val !== 'Fresher',
    then: (schema) => schema.required('Months is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  currentCompany: yup.string().when('experienceLevel', {
    is: (val: string) => val && val !== 'Fresher',
    then: (schema) => schema.required('Current Company is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  currentLocation: yup.string().when('experienceLevel', {
    is: (val: string) => val && val !== 'Fresher',
    then: (schema) => schema.required('Current Location is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  currentCTC: yup.string().when('experienceLevel', {
    is: (val: string) => val && val !== 'Fresher',
    then: (schema) => schema.required('Current CTC is required'),
    otherwise: (schema) => schema.nullable(),
  }),
});

const step3Schema = yup.object().shape({
  skills: yup.array().of(yup.string()).min(1, 'At least one skill required'),
  jobType: yup.array().of(yup.string()).min(1, 'Select at least one job type'),
  expectedSalary: yup.string().required('Expected Salary is required'),
  preferredLocation: yup.string().required('Preferred Location is required'),
  preferredShift: yup.string().required('Preferred Shift is required'),
  noticePeriod: yup.string().required('Notice Period is required'),
});

const step4Schema = yup.object().shape({
  qualification: yup.string().required('Highest Qualification is required'),
  college: yup.string().required('College Name is required'),
  passingYear: yup.date().required('Passing Year is required').nullable(),
  percentage: yup.string().required('Percentage/CGPA is required'),
});

const step5Schema = yup.object().shape({
  profileImage: yup.mixed().nullable(),
  resume: yup.mixed().nullable().required('Resume is required'),
  portfolio: yup.string().url('Must be a valid URL').nullable(),
});

const CandidateProfileSteps: React.FC<CandidateProfileStepsProps> = ({
  currentStep,
  onStepChange,
  onStepSave,
  onAllComplete,
  onSkipStep,
  saving,
  totalSteps,
}) => {
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [editingLangIndex, setEditingLangIndex] = useState<number | null>(null);

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 0: return step1Schema;
      case 1: return step2Schema;
      case 2: return step3Schema;
      case 3: return step4Schema;
      case 4: return step5Schema;
      default: return yup.object().shape({});
    }
  };

  const { control, handleSubmit, formState: { errors }, watch, trigger } = useForm({
    resolver: yupResolver(getSchemaForStep(currentStep) as any),
    defaultValues: {
      dob: null, gender: '', city: '', state: '', maritalStatus: '', languages: [],
      summary: '', jobTitle: '', experienceLevel: '', experienceYears: '', experienceMonths: '',
      currentCompany: '', currentLocation: '', currentCTC: '',
      skills: [], noticePeriod: '', jobType: [], expectedSalary: '', preferredLocation: '', preferredShift: '',
      qualification: '', college: '', passingYear: null, percentage: '',
      profileImage: null, resume: null, portfolio: '',
    }
  });

  const handleNext = async (data: any) => {
    const isValid = await trigger();
    if (isValid) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // Build step-specific payload for API
      const stepPayload = buildStepPayload(currentStep, data);
      onStepSave(stepPayload, currentStep);

      if (currentStep < totalSteps - 1) {
        onStepChange(currentStep + 1);
      } else {
        onAllComplete();
      }
    }
  };

  const buildStepPayload = (step: number, data: any) => {
    switch (step) {
      case 0:
        return {
          dob: data.dob, gender: data.gender, maritalStatus: data.maritalStatus,
          languages: data.languages, city: data.city, state: data.state,
        };
      case 1:
        return {
          summary: data.summary, jobTitle: data.jobTitle,
          experienceLevel: data.experienceLevel,
          yearsOfExperience: data.experienceLevel !== 'Fresher' ? `${data.experienceYears} Years ${data.experienceMonths} Months` : '0 Years',
          currentCompany: data.currentCompany, currentLocation: data.currentLocation,
          currentCTC: data.currentCTC,
        };
      case 2:
        return {
          skills: data.skills, noticePeriod: data.noticePeriod,
          jobType: data.jobType, expectedSalary: data.expectedSalary,
          preferredLocation: data.preferredLocation, preferredShift: data.preferredShift,
        };
      case 3:
        return {
          qualification: data.qualification, college: data.college,
          passingYear: data.passingYear, percentage: data.percentage,
        };
      case 4:
        return {
          profileImage: data.profileImage, resume: data.resume,
          portfolio: data.portfolio,
        };
      default:
        return data;
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
      <Controller control={control} name="dob" render={({ field: { onChange, value } }) => (
        <DatePickerInput label="Date of Birth" placeholder="Select your date of birth" value={value as any} onChange={onChange} error={errors.dob?.message as string} />
      )} />
      <Controller control={control} name="gender" render={({ field: { onChange, value } }) => (
        <DropdownInput label="Gender" placeholder="Select your gender" value={value} options={['Male', 'Female', 'Other']} onSelect={onChange} error={errors.gender?.message as string} />
      )} />
      <Controller control={control} name="maritalStatus" render={({ field: { onChange, value } }) => (
        <DropdownInput label="Marital Status" placeholder="Select" value={value} options={['Single', 'Married', 'Divorced']} onSelect={onChange} error={errors.maritalStatus?.message as string} />
      )} />

      <View style={{ marginBottom: hp('2%') }}>
        <Text style={{ fontSize: RFValue(10), color: Colors.textSecondary, marginBottom: hp('1%') }}>Languages Known*</Text>
        <Controller control={control} name="languages" render={({ field: { onChange, value } }) => {
          const langs = (value || []) as LanguageData[];
          return (
            <View>
              {langs.map((lang: LanguageData, index: number) => (
                <View key={index} style={styles.langCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.langName}>{lang.language}</Text>
                    <Text style={styles.langDetail}>{lang.proficiency} • {lang.comfortableIn.join(', ')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: wp('3%') }}>
                    <TouchableOpacity onPress={() => { setEditingLangIndex(index); setIsLangModalVisible(true); }}>
                      <Edit2 size={RFValue(12)} color={Colors.info} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onChange(langs.filter((_, i) => i !== index))}>
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
              {errors.languages && <Text style={styles.errorText}>{errors.languages.message as string}</Text>}
              <LanguageProficiencyModal
                visible={isLangModalVisible}
                onClose={() => { setIsLangModalVisible(false); setEditingLangIndex(null); }}
                existingLanguages={langs.map((l) => l.language)}
                initialData={editingLangIndex !== null ? langs[editingLangIndex] : null}
                onSave={(data) => {
                  if (editingLangIndex !== null) {
                    const updated = [...langs];
                    updated[editingLangIndex] = data;
                    onChange(updated);
                  } else {
                    onChange([...langs, data]);
                  }
                }}
              />
            </View>
          )
        }} />
      </View>

      <View style={{ flexDirection: 'row', gap: wp('4%') }}>
        <View style={{ flex: 1 }}>
          <Controller control={control} name="city" render={({ field: { onChange, value } }) => (
            <CustomInput label="City" placeholder="City" value={value} onChangeText={onChange} error={errors.city?.message as string} />
          )} />
        </View>
        <View style={{ flex: 1 }}>
          <Controller control={control} name="state" render={({ field: { onChange, value } }) => (
            <CustomInput label="State" placeholder="State" value={value} onChangeText={onChange} error={errors.state?.message as string} />
          )} />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => {
    const expLevel = watch('experienceLevel');
    const isExperienced = expLevel && expLevel !== 'Fresher';
    return (
      <View>
        <Controller control={control} name="summary" render={({ field: { onChange, value } }) => (
          <CustomInput label="Profile Summary" placeholder="Brief overview of your professional background" value={value} onChangeText={onChange} error={errors.summary?.message as string} />
        )} />
        <Controller control={control} name="jobTitle" render={({ field: { onChange, value } }) => (
          <CustomInput label="Job Title" placeholder="Enter your current job role" value={value} onChangeText={onChange} error={errors.jobTitle?.message as string} />
        )} />
        <Controller control={control} name="experienceLevel" render={({ field: { onChange, value } }) => (
          <DropdownInput label="Experience Level" placeholder="Select experience level" value={value} options={['Fresher', 'Intermediate', 'Senior', 'Executive']} onSelect={onChange} error={errors.experienceLevel?.message as string} />
        )} />
        {isExperienced && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={{ flexDirection: 'row', gap: wp('4%') }}>
              <View style={{ flex: 1 }}>
                <Controller control={control} name="experienceYears" render={({ field: { onChange, value } }) => (
                  <DropdownInput label="Exp. Years" placeholder="Years" value={value} options={Array.from({ length: 31 }, (_, i) => String(i))} onSelect={onChange} error={errors.experienceYears?.message as string} />
                )} />
              </View>
              <View style={{ flex: 1 }}>
                <Controller control={control} name="experienceMonths" render={({ field: { onChange, value } }) => (
                  <DropdownInput label="Exp. Months" placeholder="Months" value={value} options={Array.from({ length: 12 }, (_, i) => String(i))} onSelect={onChange} error={errors.experienceMonths?.message as string} />
                )} />
              </View>
            </View>
            <Controller control={control} name="currentCompany" render={({ field: { onChange, value } }) => (
              <CustomInput label="Current Company" placeholder="Company Name" value={value} onChangeText={onChange} error={errors.currentCompany?.message as string} />
            )} />
            <Controller control={control} name="currentLocation" render={({ field: { onChange, value } }) => (
              <CustomInput label="Current Location" placeholder="e.g. Bangalore" value={value} onChangeText={onChange} error={errors.currentLocation?.message as string} />
            )} />
            <Controller control={control} name="currentCTC" render={({ field: { onChange, value } }) => (
              <CustomInput label="Current CTC (LPA)" placeholder="e.g. 8" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.currentCTC?.message as string} />
            )} />
          </Animated.View>
        )}
      </View>
    );
  };

  const renderStep3 = () => (
    <View>
      <Controller control={control} name="skills" render={({ field: { onChange, value } }) => (
        <MultiSelectTags
          label="Skills" placeholder="Type skill and press enter"
          tags={value || []}
          onAddTag={(tag) => onChange([...(value || []), tag])}
          onRemoveTag={(tag) => onChange((value || []).filter((t: string) => t !== tag))}
          error={errors.skills?.message as string}
        />
      )} />
      <Controller control={control} name="jobType" render={({ field: { onChange, value } }) => (
        <MultiSelectTags
          label="Preferred Job Types" placeholder="Select job types"
          tags={value || []}
          onAddTag={(tag) => onChange([...(value || []), tag])}
          onRemoveTag={(tag) => onChange((value || []).filter((t: string) => t !== tag))}
          error={errors.jobType?.message as string}
          options={['Full-time', 'Part-time', 'Contract', 'Remote']}
        />
      )} />
      <Controller control={control} name="preferredLocation" render={({ field: { onChange, value } }) => (
        <CustomInput label="Preferred Location" placeholder="e.g. Remote, Bangalore, Delhi" value={value} onChangeText={onChange} error={errors.preferredLocation?.message as string} />
      )} />
      <View style={{ flexDirection: 'row', gap: wp('4%') }}>
        <View style={{ flex: 1 }}>
          <Controller control={control} name="preferredShift" render={({ field: { onChange, value } }) => (
            <DropdownInput label="Preferred Shift" placeholder="Select" value={value} options={['Day Shift', 'Night Shift', 'Flexible']} onSelect={onChange} error={errors.preferredShift?.message as string} />
          )} />
        </View>
        <View style={{ flex: 1 }}>
          <Controller control={control} name="noticePeriod" render={({ field: { onChange, value } }) => (
            <DropdownInput label="Availability" placeholder="Notice Period" value={value} options={['Immediate', '15 Days', '30 Days', '60 Days', '90 Days']} onSelect={onChange} error={errors.noticePeriod?.message as string} />
          )} />
        </View>
      </View>
      <Controller control={control} name="expectedSalary" render={({ field: { onChange, value } }) => (
        <CustomInput label="Expected Salary (LPA)" placeholder="e.g. 10" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.expectedSalary?.message as string} />
      )} />
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Controller control={control} name="qualification" render={({ field: { onChange, value } }) => (
        <DropdownInput label="Highest Qualification" placeholder="Select qualification" value={value} options={['B.Tech', 'M.Tech', 'B.Sc', 'BCA', 'MCA', 'Other']} onSelect={onChange} error={errors.qualification?.message as string} />
      )} />
      <Controller control={control} name="college" render={({ field: { onChange, value } }) => (
        <CustomInput label="College Name" placeholder="Enter your college or university name" value={value} onChangeText={onChange} error={errors.college?.message as string} />
      )} />
      <Controller control={control} name="passingYear" render={({ field: { onChange, value } }) => (
        <DatePickerInput label="Passing Year" placeholder="Select graduation year" value={value as any} onChange={onChange} error={errors.passingYear?.message as string} />
      )} />
      <Controller control={control} name="percentage" render={({ field: { onChange, value } }) => (
        <CustomInput label="Percentage/CGPA" placeholder="Enter final percentage or CGPA" keyboardType="numeric" value={value} onChangeText={onChange} error={errors.percentage?.message as string} />
      )} />
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Controller control={control} name="profileImage" render={({ field: { onChange, value } }) => (
        <UploadCard label="Profile Image" type="image" value={value as any} onChange={onChange} error={errors.profileImage?.message as string} placeholder="Upload your professional photo" />
      )} />
      <Controller control={control} name="resume" render={({ field: { onChange, value } }) => (
        <UploadCard label="Resume (PDF/DOC)" type="document" value={value as any} onChange={onChange} error={errors.resume?.message as string} placeholder="Upload your resume" />
      )} />
      <Controller control={control} name="portfolio" render={({ field: { onChange, value } }) => (
        <CustomInput label="Portfolio Link (Optional)" placeholder="https://yourportfolio.com" value={value} onChangeText={onChange} error={errors.portfolio?.message as string} autoCapitalize="none" />
      )} />
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
          onPress={handleSubmit(handleNext)}
          loading={saving}
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
