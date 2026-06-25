import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
  TextInput, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Check, Plus, X, MapPin, Briefcase, IndianRupee, GraduationCap, Users, Calendar, Gift, Award, Globe } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import DatePickerInput from '../../components/forms/DatePickerInput';
import { ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchableDropdown from '../../components/forms/SearchableDropdown';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';
import { useDispatch } from 'react-redux';
import {
  getJobDepartmentsSlice,
  createJobDepartmentSlice,
  getJobIndustriesSlice,
  createJobIndustrySlice,
  getJobTitlesSlice,
  createJobTitleSlice,
  getJobLocationsSlice,
  createJobLocationSlice,
  getSkillsByJobTitleSlice,
  searchSkillsSlice,
  createSkillSlice,
  postJobSlice,
} from '../../redux/PostJobSlice';
import { useFocusEffect } from '@react-navigation/native';


const STEPS = ['Job Details', 'Requirements', 'Preferences', 'Review'];

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];
const EDUCATION_LEVELS = ['High School', 'Diploma', 'Graduate', 'Doctorate', 'Post Graduate'];
const LANGUAGES_LIST = ['English', 'Hindi', 'Urdu', 'Punjabi', 'Bengali', 'Other'];

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
  industry: string;
  title: string;
  department: string;
  location: string[];
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
  languages: string[];
};

const INITIAL: StepData = {
  industry: '',
  title: '',
  department: '',
  location: [],
  employmentType: '',
  minSalary: '',
  maxSalary: '',
  salaryType: 'yearly',
  description: '',
  category: '',
  skills: ['React native', 'Android', 'iOS', 'Flutter', 'React', 'Node', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
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
  languages: [],
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

const PostJobScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<StepData>(INITIAL);
  const [managerData, setManagerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<any>();
  const [departmentsData, setDepartmentsData] = useState<any>(null);
  const [industriesData, setIndustriesData] = useState<any>(null);
  const [jobTitlesData, setJobTitlesData] = useState<any>(null);
  const [locationsData, setLocationsData] = useState<any>(null);
  const [searchedSkillsList, setSearchedSkillsList] = useState<string[]>([]);
  const [skillMap, setSkillMap] = useState<Record<string, number>>({});

  const addSkillsToMap = useCallback((skillsList: any[]) => {
    if (!Array.isArray(skillsList)) return;
    setSkillMap(prev => {
      const next = { ...prev };
      skillsList.forEach((s: any) => {
        if (s && typeof s === 'object') {
          const name = s.skill_name || s.name;
          const id = s.id;
          if (name && id) {
            next[name.toLowerCase().trim()] = id;
          }
        }
      });
      return next;
    });
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const depts = await dispatch(getJobDepartmentsSlice()).unwrap();
      setDepartmentsData(depts);
    } catch (e) {
      console.log('Error fetching departments', e);
    }
    try {
      const inds = await dispatch(getJobIndustriesSlice()).unwrap();
      setIndustriesData(inds);
    } catch (e) {
      console.log('Error fetching industries', e);
    }
    try {
      const titles = await dispatch(getJobTitlesSlice()).unwrap();
      setJobTitlesData(titles);
    } catch (e) {
      console.log('Error fetching titles', e);
    }
    try {
      const locs = await dispatch(getJobLocationsSlice()).unwrap();
      setLocationsData(locs);
    } catch (e) {
      console.log('Error fetching locations', e);
    }
  }, [dispatch]);

  useFocusEffect(useCallback(() => {
    fetchAllData();
  }, [fetchAllData]));

  const departmentNames = useMemo(() => {
    console.log('departmentsData', departmentsData)
    return departmentsData?.job_departments
      ?.filter((d: any) => typeof d === 'string' || Number(d?.status) === 1)
      ?.map((d: any) => typeof d === 'string' ? d : (d.department_name || '')) || [];
  }, [departmentsData]);

  const industryNames = useMemo(() => {
    console.log('industriesData', industriesData)
    return industriesData?.job_industries
      ?.filter((i: any) => typeof i === 'string' || Number(i?.status) === 1)
      ?.map((i: any) => typeof i === 'string' ? i : (i.industry_name || '')) || [];
  }, [industriesData]);

  const jobTitleNames = useMemo(() => {
    console.log('jobTitlesData', jobTitlesData)
    return jobTitlesData?.job_titles?.map((t: any) => typeof t === 'string' ? t : (t.job_name || '')) || [];
  }, [jobTitlesData]);

  const locationNames = useMemo(() => {
    console.log('locationsData', locationsData)
    return locationsData?.job_locations?.map((l: any) => typeof l === 'string' ? l : (l.location_name || l.suggested_location_name)) || [];
  }, [locationsData]);

  const selectedJobTitleId = useMemo(() => {
    if (!data.title || !jobTitlesData?.job_titles) return null;
    const found = jobTitlesData.job_titles.find((t: any) => t.job_name === data.title);
    return found?.id || null;
  }, [data.title, jobTitlesData]);

  useEffect(() => {
    if (selectedJobTitleId) {
      const fetchSkills = async () => {
        try {
          console.log('Fetching skills for job title ID:', selectedJobTitleId);
          const response = await dispatch(getSkillsByJobTitleSlice(selectedJobTitleId)).unwrap();
          console.log('Fetching skills for job title ID:', response)
          const skillsList = response?.skills || [];
          addSkillsToMap(skillsList);
          const skillNames = Array.from(
            new Set(
              skillsList
                ?.filter((s: any) => s && s.skill_name)
                ?.map((s: any) => s.skill_name)
            )
          ) as string[];
          set('skills', skillNames);
        } catch (e) {
          console.log('Error fetching skills for title:', e);
        }
      };
      fetchSkills();
    }
  }, [selectedJobTitleId, dispatch, addSkillsToMap]);

  const handleSearchSkills = useCallback(async (text: string) => {
    if (text.trim().length >= 3) {
      try {
        const response = await dispatch(searchSkillsSlice(text.trim())).unwrap();
        console.log('response search', response)
        const skillsList = response?.skills || response || [];
        addSkillsToMap(skillsList);
        console.log('skillList', skillsList)
        const skillNames = skillsList?.map((s: any) => typeof s === 'string' ? s : (s.skill_name || '')) || [];
        setSearchedSkillsList(skillNames);
      } catch (e) {
        console.log('Error searching skills:', e);
      }
    } else {
      setSearchedSkillsList([]);
    }
  }, [dispatch, addSkillsToMap]);

  useEffect(() => {
    const loadManager = async () => {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) setManagerData(JSON.parse(stored));
    };
    loadManager();
  }, []);

  const set = (key: keyof StepData, val: any) => setData(prev => ({ ...prev, [key]: val }));



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

  const handlePostJob = async () => {
    try {
      setLoading(true);

      const getJobTypeKey = (type: string) => {
        switch (type) {
          case 'Full-Time': return 'full_time';
          case 'Part-Time': return 'part_time';
          case 'Contract': return 'contract';
          case 'Internship': return 'internship';
          case 'Remote': return 'remote';
          default: return type.toLowerCase().replace('-', '_');
        }
      };

      const formatDate = (date: Date | null) => {
        if (!date) return '';
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const location_ids: number[] = [];
      const suggested_location_ids: number[] = [];

      data.location.forEach(name => {
        const found = locationsData?.job_locations?.find((l: any) =>
          typeof l !== 'string' &&
          (l.location_name?.toLowerCase() === name.toLowerCase() ||
            l.suggested_location_name?.toLowerCase() === name.toLowerCase())
        );
        if (found) {
          if (found.location_name) {
            location_ids.push(found.id);
          } else if (found.suggested_location_name) {
            suggested_location_ids.push(found.id);
          }
        }
      });

      const selectedJobTitleId = (() => {
        if (!data.title || !jobTitlesData?.job_titles) return null;
        const found = jobTitlesData.job_titles.find((t: any) => t.job_name === data.title);
        return found?.id || null;
      })();

      const selectedJobIndustryId = (() => {
        if (!data.industry || !industriesData?.job_industries) return null;
        const found = industriesData.job_industries.find((i: any) => i.industry_name === data.industry);
        return found?.id || null;
      })();

      const selectedJobDepartmentId = (() => {
        if (!data.department || !departmentsData?.job_departments) return null;
        const found = departmentsData.job_departments.find((d: any) => d.department_name === data.department);
        return found?.id || null;
      })();

      const mappedSkills = data.skills
        .map(name => skillMap[name.toLowerCase().trim()])
        .filter(id => id !== undefined);

      const payload = {
        job_title_id: selectedJobTitleId ? String(selectedJobTitleId) : "",
        job_industry_id: selectedJobIndustryId,
        job_department_id: selectedJobDepartmentId,
        job_type: getJobTypeKey(data.employmentType),
        experience: data.isFresher ? 'Fresher' : `${data.minExperience}-${data.maxExperience} Years`,
        education: data.education.join(', '),
        openings: Number(data.openings) || 1,
        location_id: location_ids,
        suggested_location_id: suggested_location_ids,
        salary_from: data.minSalary,
        salary_to: data.maxSalary,
        job_description: data.description,
        benefits: data.benefits.join(', '),
        languages: data.languages.join(', '),
        is_urgent: data.urgent,
        status: "active",
        expiry_date: formatDate(data.applicationDeadline),
        salary_type: data.salaryType,
        question: data.customQuestions,
        skills: mappedSkills,
      };

      console.log('PostJob Payload:', payload);
      ToastAndroid.show('Job published successfully!', ToastAndroid.SHORT);
      const response = await dispatch(postJobSlice(payload)).unwrap();
      console.log('PostJob response:', response);

      navigation.goBack();
    } catch (error: any) {
      console.log('error', error);
      ToastAndroid.show(error?.message || error?.response?.data?.message || 'Failed to process job request', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 0) return data.industry && data.title && data.department && data.employmentType;
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
        if (!(data.industry && data.title && data.department && data.employmentType)) return false;
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
          title="Post a Job"
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
              <Field label="Industry *">
                <SearchableDropdown
                  data={industryNames}
                  placeholder="Select or search industry"
                  value={data.industry}
                  onSelect={async v => {
                    set('industry', v);
                    if (v && !industryNames.includes(v)) {
                      try {
                        console.log('Creating new industry:', v);
                        const payload = {
                          industry_name: v
                        }
                        await dispatch(createJobIndustrySlice(payload as any)).unwrap();
                        const inds = await dispatch(getJobIndustriesSlice()).unwrap();
                        setIndustriesData(inds);
                      } catch (err) {
                        console.error('Failed to create industry', err);
                      }
                    }
                  }}
                />
              </Field>

              <Field label="Department *">
                <SearchableDropdown
                  data={departmentNames}
                  placeholder="Select or search department"
                  value={data.department}
                  onSelect={async v => {
                    set('department', v);
                    if (v && !departmentNames.includes(v)) {
                      try {
                        console.log('Creating new department:', v);
                        const payload = {
                          department_name: v
                        }
                        await dispatch(createJobDepartmentSlice(payload as any)).unwrap();
                        const depts = await dispatch(getJobDepartmentsSlice()).unwrap();
                        setDepartmentsData(depts);
                      } catch (err) {
                        console.error('Failed to create department', err);
                      }
                    }
                  }}
                />
              </Field>

              <Field label="Job Title *">
                <SearchableDropdown
                  data={jobTitleNames}
                  placeholder="e.g. Senior React Native Developer"
                  value={data.title}
                  onSelect={async v => {
                    set('title', v);
                    if (v && !jobTitleNames.includes(v)) {
                      try {
                        console.log('Creating new job title:', v);
                        const payload = {
                          job_name: v
                        }
                        await dispatch(createJobTitleSlice(payload as any)).unwrap();
                        const titles = await dispatch(getJobTitlesSlice()).unwrap();
                        setJobTitlesData(titles);
                      } catch (err) {
                        console.error('Failed to create job title', err);
                      }
                    }
                  }}
                />
              </Field>

              <Field label="Location">
                <SearchableDropdown
                  data={locationNames}
                  placeholder="Select or search location"
                  isMulti={true}
                  selectedValues={data.location}
                  onSelectMulti={async selectedList => {
                    set('location', selectedList);
                    const newLoc = selectedList.find(loc => !locationNames.includes(loc));
                    if (newLoc) {
                      try {
                        console.log('Creating new location:', newLoc);
                        const payload = {
                          suggested_location_name: newLoc
                        }
                        const res = await dispatch(createJobLocationSlice(payload as any)).unwrap();
                        console.log('res', res);
                        if (res?.job_location) {
                          setLocationsData((prev: any) => {
                            if (!prev) return { job_locations: [res.job_location] };
                            return {
                              ...prev,
                              job_locations: [...(prev.job_locations || []), res.job_location]
                            };
                          });
                        }
                      } catch (err) {
                        console.error('Failed to create location', err);
                      }
                    }
                  }}
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
                <SearchableDropdown
                  data={searchedSkillsList}
                  placeholder="Search and select skills..."
                  isMulti={true}
                  selectedValues={data.skills}
                  onSearchTextChange={handleSearchSkills}
                  onSelectMulti={async (selectedList) => {
                    set('skills', selectedList);
                    const newlyAdded = selectedList.find(s => !searchedSkillsList.includes(s) && !data.skills.includes(s));
                    if (newlyAdded) {
                      try {
                        const payload = {
                          job_title_id: selectedJobTitleId,
                          skill_name: newlyAdded
                        }
                        console.log('Creating new skill:', payload);
                        const response = await dispatch(createSkillSlice(payload as any)).unwrap();
                        console.log('Skill created successfully', response);
                        if (response?.skill) {
                          addSkillsToMap([response.skill]);
                        } else if (response?.id) {
                          addSkillsToMap([response]);
                        } else if (response?.data) {
                          addSkillsToMap([response.data]);
                        }
                      } catch (err) {
                        console.error('Failed to create skill', err);
                      }
                    }
                  }}
                />
              </Field>

              <Field label="Required Languages">
                <MultiChipSelect options={LANGUAGES_LIST} value={data.languages} onSelect={v => set('languages', v)} />
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
                  { label: 'Industry', value: data.industry || 'Not specified', icon: <Globe size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Department', value: data.department || 'Not specified', icon: <Briefcase size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Location', value: data.location.length > 0 ? data.location.join(', ') : 'Not specified', icon: <MapPin size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Salary', value: data.minSalary && data.maxSalary ? `₹${data.minSalary}–${data.maxSalary} ${data.salaryType === 'yearly' ? 'LPA' : 'Monthly'}` : 'Not specified', icon: <IndianRupee size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Experience', value: data.isFresher ? 'Fresher' : `${data.minExperience}-${data.maxExperience} Years`, icon: <Award size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Education', value: data.education && data.education.length > 0 ? data.education.join(', ') : 'Not specified', icon: <GraduationCap size={wp('4%')} color={Colors.textSecondary} /> },
                  { label: 'Languages', value: data.languages.length > 0 ? data.languages.join(', ') : 'Not specified', icon: <Globe size={wp('4%')} color={Colors.textSecondary} /> },
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
                await handlePostJob();
              }
            }}
            disabled={!canNext()}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {loading ? 'Posting...' : (step === STEPS.length - 1 ? 'Post Job' : 'Continue')}
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
