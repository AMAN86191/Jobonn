import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
  TextInput, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Check, Plus, X, MapPin, Briefcase, IndianRupee, GraduationCap, Users, Calendar, Gift, Award } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import DatePickerInput from '../../components/forms/DatePickerInput';
import { ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import SearchableDropdown from '../../components/forms/SearchableDropdown';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';

const STEPS = ['Job Details', 'Requirements', 'Preferences', 'Review'];

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];
const EDUCATION_LEVELS = ['High School', 'Diploma', 'Graduate', 'Doctorate', 'Post Graduate'];

const PREDEFINED_BENEFITS = [
  'Health Insurance',
  'Flexible Hours',
  'Remote Work',
  'Paid Time Off',
  'Performance Bonus',
  'Gym Membership',
  'Free Meals',
  'Professional Development',
];

type StepData = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  minSalary: string;
  maxSalary: string;
  salaryType: 'monthly' | 'yearly';
  description: string;
  category: string;
  skills: string[];
  skillInput: string;
  isFresher: boolean;
  minExperience: string;
  maxExperience: string;
  education: string[];
  openings: string;
  benefits: string[];
  benefitInput: string;
  applicationDeadline: Date | null;
  urgent: boolean;
  customQuestions: string[];
  questionInput: string;
};

const INITIAL: StepData = {
  title: '',
  department: '',
  location: '',
  employmentType: '',
  minSalary: '',
  maxSalary: '',
  salaryType: 'yearly',
  description: '',
  category: '',
  skills: ['React native', 'Android', 'iOS', 'Flutter', 'React', 'Node', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SQL', 'NoSQL', 'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Firebase', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Trello', 'Asana', 'Slack', 'Zoom', 'Microsoft Teams', 'Google Meet'],
  skillInput: '',
  isFresher: true,
  minExperience: '',
  maxExperience: '',
  education: [],
  openings: '1',
  benefits: [],
  benefitInput: '',
  applicationDeadline: null,
  urgent: false,
  customQuestions: [],
  questionInput: '',
};

const StepIndicator = ({ current, onChangeStep }: { current: number; onChangeStep: (step: number) => void }) => (
  <View style={styles.stepIndicator}>
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onChangeStep(i)}
          style={styles.stepItem}
        >
          <View style={[
            styles.stepDot,
            i < current && styles.stepDotDone,
            i === current && styles.stepDotActive,
          ]}>
            {i < current
              ? <Check color={Colors.white} size={wp('3%')} strokeWidth={3} />
              : <Text style={[styles.stepNum, i === current && { color: Colors.white }]}>{i + 1}</Text>
            }
          </View>
          <Text style={[styles.stepLabel, i === current && styles.stepLabelActive]}>{label}</Text>
        </TouchableOpacity>
        {i < STEPS.length - 1 && (
          <View style={[styles.stepLine, i < current && styles.stepLineDone]} />
        )}
      </React.Fragment>
    ))}
  </View>
);

const ChipSelect = ({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) => (
  <View style={styles.chips}>
    {options.map(opt => (
      <Pressable
        key={opt}
        style={[styles.chip, value === opt && styles.chipActive]}
        onPress={() => onSelect(opt)}
      >
        <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>{opt}</Text>
      </Pressable>
    ))}
  </View>
);

const MultiChipSelect = ({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string[];
  onSelect: (v: string[]) => void;
}) => {
  const toggleSelect = (opt: string) => {
    if (value.includes(opt)) {
      onSelect(value.filter(x => x !== opt));
    } else {
      onSelect([...value, opt]);
    }
  };

  return (
    <View style={styles.chips}>
      {options.map(opt => {
        const isSelected = value.includes(opt);
        return (
          <Pressable
            key={opt}
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => toggleSelect(opt)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

const PostJobScreen = ({ navigation, route }: any) => {
  const editJob = route?.params?.job;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<StepData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState<any>(null);

  useEffect(() => {
    const loadManager = async () => {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) setManagerData(JSON.parse(stored));
    };
    loadManager();
  }, []);

  useEffect(() => {
    if (editJob) {
      // Parse salary (e.g. "12-15 LPA" or "20-30 Monthly")
      let minSalary = '';
      let maxSalary = '';
      let salaryType: 'monthly' | 'yearly' = 'yearly';
      if (editJob.salary) {
        const cleanSalary = editJob.salary.toLowerCase();
        if (cleanSalary.includes('month')) {
          salaryType = 'monthly';
        } else {
          salaryType = 'yearly';
        }
        const cleanNums = editJob.salary.replace(/lpa/gi, '').replace(/monthly/gi, '').replace(/pm/gi, '').trim();
        const parts = cleanNums.split('-');
        if (parts.length === 2) {
          minSalary = parts[0].trim();
          maxSalary = parts[1].trim();
        }
      }

      // Parse experience (e.g. "Fresher" or "3-5 years")
      let isFresher = true;
      let minExperience = '';
      let maxExperience = '';
      if (editJob.experience) {
        if (editJob.experience.toLowerCase() === 'fresher') {
          isFresher = true;
        } else {
          isFresher = false;
          const cleanExp = editJob.experience.replace(' years', '').replace(' yrs', '').trim();
          const parts = cleanExp.split('-');
          if (parts.length === 2) {
            minExperience = parts[0];
            maxExperience = parts[1];
          }
        }
      }

      // Parse education
      let educationArray: string[] = [];
      if (editJob.education) {
        if (Array.isArray(editJob.education)) {
          educationArray = editJob.education;
        } else if (typeof editJob.education === 'string') {
          educationArray = editJob.education.split(',').map((e: string) => e.trim()).filter(Boolean);
        }
      }

      setData({
        title: editJob.title || '',
        department: editJob.department || '',
        location: editJob.location || '',
        employmentType: editJob.job_type || editJob.employmentType || '',
        minSalary: minSalary,
        maxSalary: maxSalary,
        salaryType: salaryType,
        description: editJob.description || '',
        category: editJob.category || '',
        skills: editJob.skills || [],
        skillInput: '',
        isFresher: isFresher,
        minExperience: minExperience,
        maxExperience: maxExperience,
        education: educationArray,
        openings: editJob.openings?.toString() || editJob.vacancies?.toString() || '1',
        benefits: editJob.benefits || [],
        benefitInput: '',
        applicationDeadline: editJob.applicationDeadline ? new Date(editJob.applicationDeadline) : null,
        urgent: !!editJob.urgent,
        customQuestions: editJob.custom_questions || editJob.questions || [],
        questionInput: '',
      });
    }
  }, [editJob]);

  const set = (key: keyof StepData, val: any) => setData(prev => ({ ...prev, [key]: val }));

  const addSkill = () => {
    const skill = data.skillInput.trim();
    if (skill && !data.skills.includes(skill)) {
      set('skills', [...data.skills, skill]);
    }
    set('skillInput', '');
  };

  const removeSkill = (s: string) => set('skills', data.skills.filter(x => x !== s));

  const addBenefit = (benefit?: string) => {
    const val = (benefit || data.benefitInput).trim();
    if (val && !data.benefits.includes(val)) {
      set('benefits', [...data.benefits, val]);
    }
    set('benefitInput', '');
  };

  const removeBenefit = (b: string) => set('benefits', data.benefits.filter(x => x !== b));

  const addQuestion = () => {
    const q = data.questionInput.trim();
    if (q && !data.customQuestions.includes(q)) {
      set('customQuestions', [...data.customQuestions, q]);
    }
    set('questionInput', '');
  };

  const removeQuestion = (q: string) => set('customQuestions', data.customQuestions.filter(x => x !== q));

  const canNext = () => {
    if (step === 0) return data.title && data.department && data.employmentType;
    if (step === 1) {
      const expValid = data.isFresher || (data.minExperience && data.maxExperience);
      return expValid && data.education && data.education.length > 0;
    }
    if (step === 2) return true;
    return true;
  };

  const canGoToStep = (target: number) => {
    if (target <= step) return true;
    for (let i = 0; i < target; i++) {
      if (i === 0) {
        if (!(data.title && data.department && data.employmentType)) return false;
      }
      if (i === 1) {
        const expValid = data.isFresher || (data.minExperience && data.maxExperience);
        if (!(expValid && data.education && data.education.length > 0)) return false;
      }
    }
    return true;
  };

  const inputStyle = [styles.input];

  return (
    <SafeAreaView style={styles.safe} >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <CommanManagerHeader
          navigation={navigation}
          title={editJob ? "Edit Job" : "Post a Job"}
          onBack={() => step === 0 ? navigation.goBack() : setStep(s => s - 1)}
        />

        <StepIndicator current={step} onChangeStep={(i) => { if (canGoToStep(i)) setStep(i); }} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.formContent, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ... existing steps ... */}
          {/* Step 0: Job Details */}
          {step === 0 && (
            <Animated.View entering={FadeInRight.duration(350)}>
              {/* <Field label="Job Title *">
                <TextInput
                  style={inputStyle}
                  placeholder="e.g. Senior React Native Developer"
                  placeholderTextColor={Colors.textSecondary}
                  value={data.title}
                  onChangeText={v => set('title', v)}
                />
              </Field> */}

              <Field label="Job Title *">
                <SearchableDropdown
                  data={[
                    'Senior React Native Developer',
                    'Full Stack Developer',
                    'Backend Engineer (Laravel)',
                    'UI/UX Designer',
                    'Mobile Lead',
                  ]}
                  placeholder="e.g. Senior React Native Developer"
                  value={data.title}
                  onSelect={v => set('title', v)}
                />
              </Field>

              {/* <Field label="Job Category *">
                <SearchableDropdown
                  data={JOB_CATEGORIES}
                  placeholder="Select or search category"
                  value={data.category}
                  onSelect={v => set('category', v)}
                />
              </Field> */}
              {/* 
              <Field label="Department *">
                <ChipSelect options={DEPARTMENTS} value={data.department} onSelect={v => set('department', v)} />
              </Field> */}
              <Field label="Department *">
                <SearchableDropdown
                  data={[
                    'Marketing',
                    'Sales',
                    'HR',
                    'Engineering',
                    'Finance',
                  ]}
                  placeholder="e.g. Marketing"
                  value={data.department}
                  onSelect={v => set('department', v)}
                />
              </Field>

              <Field label="Location">
                <TextInput
                  style={inputStyle}
                  placeholder="e.g. Bangalore / Remote"
                  placeholderTextColor={Colors.textSecondary}
                  value={data.location}
                  onChangeText={v => set('location', v)}
                />
              </Field>

              <Field label="Employment Type *">
                <ChipSelect options={EMPLOYMENT_TYPES} value={data.employmentType} onSelect={v => set('employmentType', v)} />
              </Field>

              <Field label="Salary Range">
                <View style={styles.salaryTypeRow}>
                  <TouchableOpacity
                    style={[styles.salaryTypeBtn, data.salaryType === 'monthly' && styles.salaryTypeBtnActive]}
                    onPress={() => set('salaryType', 'monthly')}
                  >
                    <Text style={[styles.salaryTypeBtnText, data.salaryType === 'monthly' && styles.salaryTypeBtnTextActive]}>Monthly</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.salaryTypeBtn, data.salaryType === 'yearly' && styles.salaryTypeBtnActive]}
                    onPress={() => set('salaryType', 'yearly')}
                  >
                    <Text style={[styles.salaryTypeBtnText, data.salaryType === 'yearly' && styles.salaryTypeBtnTextActive]}>Yearly (LPA)</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.salaryRow}>
                  <TextInput
                    style={[inputStyle, styles.salaryInput]}
                    placeholder={data.salaryType === 'monthly' ? "Min (e.g. 20k)" : "Min (e.g. 3)"}
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={data.minSalary}
                    onChangeText={v => set('minSalary', v)}
                  />
                  <Text style={styles.salaryDash}>—</Text>
                  <TextInput
                    style={[inputStyle, styles.salaryInput]}
                    placeholder={data.salaryType === 'monthly' ? "Max (e.g. 35k)" : "Max (e.g. 6)"}
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={data.maxSalary}
                    onChangeText={v => set('maxSalary', v)}
                  />
                </View>
              </Field>

              <Field label="Job Description">
                <TextInput
                  style={[inputStyle, styles.textArea]}
                  placeholder="Describe the role, responsibilities, and what makes it great..."
                  placeholderTextColor={Colors.textSecondary}
                  value={data.description}
                  onChangeText={v => set('description', v)}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </Field>
            </Animated.View>
          )}

          {step === 1 && (
            <Animated.View entering={FadeInRight.duration(350)}>
              <Field label="Experience Type *">
                <View style={styles.experienceTypeRow}>
                  <TouchableOpacity
                    style={[styles.expTypeBtn, data.isFresher && styles.expTypeBtnActive]}
                    onPress={() => set('isFresher', true)}
                  >
                    <Text style={[styles.expTypeBtnText, data.isFresher && styles.expTypeBtnTextActive]}>Fresher</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.expTypeBtn, !data.isFresher && styles.expTypeBtnActive]}
                    onPress={() => set('isFresher', false)}
                  >
                    <Text style={[styles.expTypeBtnText, !data.isFresher && styles.expTypeBtnTextActive]}>Experienced</Text>
                  </TouchableOpacity>
                </View>
              </Field>

              {!data.isFresher && (
                <Field label="Experience Range (Years) *">
                  <View style={styles.salaryRow}>
                    <TextInput
                      style={[inputStyle, styles.salaryInput]}
                      placeholder="Min"
                      placeholderTextColor={Colors.textSecondary}
                      keyboardType="numeric"
                      value={data.minExperience}
                      onChangeText={v => set('minExperience', v)}
                    />
                    <Text style={styles.salaryDash}>—</Text>
                    <TextInput
                      style={[inputStyle, styles.salaryInput]}
                      placeholder="Max"
                      placeholderTextColor={Colors.textSecondary}
                      keyboardType="numeric"
                      value={data.maxExperience}
                      onChangeText={v => set('maxExperience', v)}
                    />
                  </View>
                </Field>
              )}

              <Field label="Education *">
                <MultiChipSelect options={EDUCATION_LEVELS} value={data.education} onSelect={v => set('education', v)} />
              </Field>

              <Field label="Required Skills">
                <View style={styles.skillInputRow}>
                  <TextInput
                    style={[inputStyle, styles.skillInputField]}
                    placeholder="Add a skill..."
                    placeholderTextColor={Colors.textSecondary}
                    value={data.skillInput}
                    onChangeText={v => set('skillInput', v)}
                    onSubmitEditing={addSkill}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill}>
                    <Plus color={Colors.white} size={wp('4.5%')} />
                  </TouchableOpacity>
                </View>
                {data.skills.length > 0 && (
                  <View style={styles.skillTags}>
                    {data.skills.map(skill => (
                      <View key={skill} style={styles.skillTag}>
                        <Text style={styles.skillTagText}>{skill}</Text>
                        <TouchableOpacity onPress={() => removeSkill(skill)}>
                          <X color={Colors.primary} size={wp('3.5%')} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </Field>
            </Animated.View>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <View >
              <View style={styles.preferenceRow}>
                <View style={{ flex: 1 }}>
                  <Field label="Number of Openings">
                    <TextInput
                      style={inputStyle}
                      placeholder="1"
                      placeholderTextColor={Colors.textSecondary}
                      keyboardType="numeric"
                      value={data.openings}
                      onChangeText={v => set('openings', v)}
                    />
                  </Field>
                </View>

                <View style={{ flex: 1.2 }}>
                  <Field label="Urgency">
                    <Pressable
                      style={[styles.urgentToggle, data.urgent && styles.urgentToggleActive, { paddingVertical: hp('1.35%') }]}
                      onPress={() => set('urgent', !data.urgent)}
                    >
                      <View style={[styles.urgentDot, data.urgent && styles.urgentDotActive]} />
                      <Text style={[styles.urgentText, data.urgent && styles.urgentTextActive]} numberOfLines={1}>
                        {data.urgent ? 'Urgently Hiring' : 'Mark as Urgent'}
                      </Text>
                    </Pressable>
                  </Field>
                </View>
              </View>

              <Field label="Application Deadline">
                <DatePickerInput
                  label=""
                  placeholder="Select deadline date"
                  value={data.applicationDeadline}
                  onChange={v => set('applicationDeadline', v)}
                />
              </Field>

              <Field label="Job Benefits">
                <View style={styles.skillInputRow}>
                  <TextInput
                    style={[inputStyle, styles.skillInputField]}
                    placeholder="Add a benefit (e.g. Free Meals)"
                    placeholderTextColor={Colors.textSecondary}
                    value={data.benefitInput}
                    onChangeText={v => set('benefitInput', v)}
                    onSubmitEditing={() => addBenefit()}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.addSkillBtn} onPress={() => addBenefit()}>
                    <Plus color={Colors.white} size={wp('4.5%')} />
                  </TouchableOpacity>
                </View>

                <View style={styles.benefitSuggestions}>
                  {PREDEFINED_BENEFITS.filter(b => !data.benefits.includes(b)).slice(0, 4).map(benefit => (
                    <TouchableOpacity
                      key={benefit}
                      style={styles.suggestionChip}
                      onPress={() => addBenefit(benefit)}
                    >
                      <Plus size={wp('3%')} color={Colors.textSecondary} />
                      <Text style={styles.suggestionChipText}>{benefit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {data.benefits.length > 0 && (
                  <View style={styles.skillTags}>
                    {data.benefits.map(benefit => (
                      <View key={benefit} style={[styles.skillTag, { backgroundColor: Colors.success + '15' }]}>
                        <Text style={[styles.skillTagText, { color: Colors.success }]}>{benefit}</Text>
                        <TouchableOpacity onPress={() => removeBenefit(benefit)}>
                          <X color={Colors.success} size={wp('3.5%')} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </Field>

              <Field label="Additional Questions">
                <View style={styles.skillInputRow}>
                  <TextInput
                    style={[inputStyle, styles.skillInputField]}
                    placeholder="Add a custom question for candidate..."
                    placeholderTextColor={Colors.textSecondary}
                    value={data.questionInput}
                    onChangeText={v => set('questionInput', v)}
                    onSubmitEditing={addQuestion}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.addSkillBtn} onPress={addQuestion}>
                    <Plus color={Colors.white} size={wp('4.5%')} />
                  </TouchableOpacity>
                </View>

                {data.customQuestions.length > 0 && (
                  <View style={styles.questionsList}>
                    {data.customQuestions.map((q, idx) => (
                      <View key={q} style={styles.questionItem}>
                        <Text style={styles.questionItemText}>{idx + 1}. {q}</Text>
                        <TouchableOpacity onPress={() => removeQuestion(q)}>
                          <X color={Colors.primary} size={wp('4.5%')} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </Field>
            </View>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Animated.View entering={FadeInRight.duration(350)}>
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>{data.title || '—'}</Text>
                <Text style={styles.reviewSub}>{data.department} · {data.employmentType}</Text>

                <View style={styles.reviewDivider} />

                {[
                  { label: 'Location', value: data.location || 'Not specified', icon: <MapPin size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Category', value: data.category || 'Not specified', icon: <Briefcase size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Salary', value: data.minSalary && data.maxSalary ? `₹${data.minSalary}–${data.maxSalary} ${data.salaryType === 'yearly' ? 'LPA' : 'Monthly'}` : 'Not specified', icon: <IndianRupee size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Experience', value: data.isFresher ? 'Fresher' : `${data.minExperience}-${data.maxExperience} Years`, icon: <Award size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Education', value: data.education && data.education.length > 0 ? data.education.join(', ') : 'Not specified', icon: <GraduationCap size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Openings', value: data.openings || '1', icon: <Users size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Deadline', value: data.applicationDeadline ? data.applicationDeadline.toLocaleDateString('en-GB') : 'Open', icon: <Calendar size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Benefits', value: data.benefits.length > 0 ? `${data.benefits.length} Added` : 'None', icon: <Gift size={wp('4%')} color={Colors.textSecondary} /> },
                ].map(row => (
                  <View key={row.label} style={styles.reviewRow}>
                    <View style={styles.reviewIconLabelRow}>
                      {row.icon}
                      <Text style={styles.reviewLabel}>{row.label}</Text>
                    </View>
                    <Text style={styles.reviewValue}>{row.value}</Text>
                  </View>
                ))}

                {data.skills.length > 0 && (
                  <>
                    <View style={styles.reviewDivider} />
                    <Text style={styles.reviewLabel}>Skills</Text>
                    <View style={styles.skillTags}>
                      {data.skills.map(s => (
                        <View key={s} style={styles.skillTag}>
                          <Text style={styles.skillTagText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {data.benefits.length > 0 && (
                  <>
                    <View style={styles.reviewDivider} />
                    <Text style={styles.reviewLabel}>Benefits</Text>
                    <View style={styles.skillTags}>
                      {data.benefits.map(b => (
                        <View key={b} style={[styles.skillTag, { backgroundColor: Colors.success + '15' }]}>
                          <Text style={[styles.skillTagText, { color: Colors.success }]}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {data.customQuestions.length > 0 && (
                  <>
                    <View style={styles.reviewDivider} />
                    <Text style={styles.reviewLabel}>Additional Questions</Text>
                    <View style={styles.questionsList}>
                      {data.customQuestions.map((q, idx) => (
                        <View key={q} style={[styles.questionItem, { backgroundColor: Colors.background }]}>
                          <Text style={styles.questionItemText}>{idx + 1}. {q}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {data.urgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>Urgently Hiring</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}
          <View style={{ height: hp('10%') }} />
        </ScrollView>

        <Animated.View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]}
            onPress={async () => {
              if (step < STEPS.length - 1) {
                setStep(s => s + 1);
              } else {
                try {
                  setLoading(true);
                  const payload = {
                    title: data.title,
                    company_name: managerData?.manager_profile?.companyName || 'JobOnn Partner',
                    location: data.location,
                    job_type: data.employmentType,
                    experience: data.isFresher ? 'Fresher' : `${data.minExperience}-${data.maxExperience} years`,
                    salary: `${data.minSalary}-${data.maxSalary} ${data.salaryType === 'yearly' ? 'LPA' : 'Monthly'}`,
                    education: data.education.join(', '),
                    description: data.description,
                    category: data.category,
                    skills: data.skills,
                    benefits: data.benefits,
                    custom_questions: data.customQuestions,
                  };

                  console.log('PostJob/UpdateJob Payload:', payload);

                  await new Promise<void>(resolve => setTimeout(() => resolve(), 600));
                  ToastAndroid.show(editJob ? 'Job updated in static MVP data!' : 'Job published in static MVP data!', ToastAndroid.SHORT);
                  navigation.goBack();
                } catch (error: any) {
                  console.log('error', error.response?.data?.message ?? error.message);
                  ToastAndroid.show(error?.response?.data?.message || 'Failed to process job request', ToastAndroid.LONG);
                } finally {
                  setLoading(false);
                }
              }
            }}
            disabled={!canNext()}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {loading ? (editJob ? 'Updating...' : 'Posting...') : (step === STEPS.length - 1 ? (editJob ? 'Update Job' : 'Post Job') : 'Continue')}
            </Text>
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                {step < STEPS.length - 1 && <ChevronRight color={Colors.white} size={wp('5%')} />}
                {step === STEPS.length - 1 && <Check color={Colors.white} size={wp('5%')} />}
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },
  stepItem: { alignItems: 'center', gap: hp('0.5%') },
  stepDot: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepDotDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  stepNum: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700' },
  stepLabel: { ...Typography.caption, textAlign: 'center' },
  stepLabelActive: { color: Colors.primary, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: hp('2%'), marginHorizontal: wp('1%') },
  stepLineDone: { backgroundColor: Colors.success },
  formContent: { paddingHorizontal: wp('4%') },
  field: { marginBottom: hp('1%') },
  fieldLabel: { ...Typography.bodySmall, fontWeight: '700', marginBottom: hp('1%') },
  input: {
    backgroundColor: Colors.white,
    borderRadius: wp('3.5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.4%'),
    borderWidth: 1,
    borderColor: Colors.border,
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  textArea: { height: hp('14%'), paddingTop: hp('1.4%') },
  salaryRow: { flexDirection: 'row', alignItems: 'center', gap: wp('2%') },
  salaryInput: { flex: 1 },
  salaryDash: { ...Typography.body, color: Colors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: wp('2%') },
  chip: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.7%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { ...Typography.caption, fontWeight: '600' },
  chipTextActive: { color: Colors.white },
  skillInputRow: { flexDirection: 'row', gap: wp('2%'), alignItems: 'center' },
  skillInputField: { flex: 1 },
  addSkillBtn: {
    width: hp('5.5%'),
    height: hp('5.5%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillTags: { flexDirection: 'row', flexWrap: 'wrap', gap: wp('2%'), marginTop: hp('1.5%') },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    backgroundColor: Colors.primary + '15',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  skillTagText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    padding: wp('4%'),
    borderRadius: wp('3.5%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urgentToggleActive: { borderColor: Colors.warning, backgroundColor: Colors.warning + '10' },
  urgentDot: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.border,
  },
  urgentDotActive: { backgroundColor: Colors.warning },
  urgentText: { ...Typography.bodySmall, fontWeight: '600' },
  urgentTextActive: { color: Colors.warning },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: wp('5%'),
    padding: wp('5%'),
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  reviewTitle: { ...Typography.h3, marginBottom: hp('0.5%') },
  reviewSub: { ...Typography.caption, fontWeight: '600', marginBottom: hp('1.5%') },
  reviewDivider: { height: 1, backgroundColor: Colors.border, marginVertical: hp('1.5%') },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.7%'),
  },
  reviewIconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    flex: 1.2,
  },
  reviewLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  reviewValue: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600', flex: 2, textAlign: 'right' },
  urgentBadge: {
    marginTop: hp('1.5%'),
    alignSelf: 'flex-start',
    backgroundColor: Colors.warning + '20',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
  },
  urgentBadgeText: { ...Typography.caption, color: Colors.warning, fontWeight: '700' },
  footer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('1%'),
    backgroundColor: Colors.primary,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.3%'),
  },
  nextBtnDisabled: { backgroundColor: Colors.textSecondary, shadowOpacity: 0 },
  nextBtnText: { ...Typography.body, color: Colors.white, fontWeight: '700' },
  experienceTypeRow: { flexDirection: 'row', gap: wp('4%') },
  expTypeBtn: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  expTypeBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  expTypeBtnText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  expTypeBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  benefitSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginTop: hp('1%'),
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: wp('2.8%'),
  },
  questionsList: { marginTop: hp('1.5%'), gap: hp('1%') },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: wp('3.5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionItemText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: wp('2%'),
  },
  preferenceRow: {
    flexDirection: 'row',
    gap: wp('3%'),
    alignItems: 'flex-end',
    marginBottom: hp('1%'),
  },
  salaryTypeRow: {
    flexDirection: 'row',
    gap: wp('3%'),
    marginBottom: hp('1%'),
  },
  salaryTypeBtn: {
    flex: 1,
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  salaryTypeBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  salaryTypeBtnText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  salaryTypeBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default PostJobScreen;
