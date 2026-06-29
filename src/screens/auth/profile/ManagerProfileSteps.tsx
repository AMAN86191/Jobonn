import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../components/inputs/CustomInput';
import CustomButton from '../../../components/buttons/CustomButton';
import DropdownInput from '../../../components/forms/DropdownInput';
import UploadCard from '../../../components/forms/UploadCard';
import AddAwardModal, { AwardData } from '../../../components/forms/AddAwardModal';
import { Colors } from '../../../theme/Colors';
import { Typography } from '../../../theme/Typography';
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Plus, Trash2, Edit2 } from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import { useDispatch } from 'react-redux';
import { getJobIndustriesSlice } from '../../../redux/PostJobSlice';

interface ManagerProfileStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onStepSave: (data: any, stepIndex: number) => void;
  onAllComplete: () => void;
  onSkipStep: (stepIndex: number) => void;
  saving: boolean;
  totalSteps: number;
  initialData?: any;
}

// Validation Schemas
const step1Schema = yup.object().shape({
  companyLogo: yup.mixed().nullable(),
  coverImage: yup.mixed().nullable(),
  companyName: yup.string().required('Company name is required'),
  location: yup.string().required('Location is required'),
  industry: yup.string().required('Industry type is required'),
  companySize: yup.string().required('Company size is required'),
  website: yup.string().required('Website is required'),
  bio: yup.string().min(20, 'Bio too short').required('Bio is required'),
});

const step2Schema = yup.object().shape({
  gstNumber: yup.string().required('GST number is required'),
  foundedDate: yup.string().required('Founded date is required'),
  awards: yup.array().of(yup.object().shape({
    title: yup.string().required(),
    description: yup.string(),
    date: yup.string().required(),
  })),
  verifDoc: yup.mixed().nullable().required('Verification document is required'),
  fb_link: yup.string().nullable(),
  insta_link: yup.string().nullable(),
  linked_link: yup.string().nullable(),
});

const ManagerProfileSteps: React.FC<ManagerProfileStepsProps> = ({
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
  const [industries, setIndustries] = useState<string[]>([
    'IT/Software', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Other'
  ]);
  const [isAwardModalVisible, setIsAwardModalVisible] = useState(false);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [isFoundedDatePickerOpen, setIsFoundedDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await dispatch(getJobIndustriesSlice() as any).unwrap();
        console.log('getJobIndustries response in steps:', response);
        const list = response?.job_industries
          ?.filter((i: any) => typeof i === 'string' || Number(i?.status) === 1)
          ?.map((i: any) => typeof i === 'string' ? i : (i.industry_name || '')) || [];
        if (list.length > 0) {
          setIndustries(list);
        }
      } catch (error) {
        console.log('Error loading industries in steps:', error);
      }
    };
    fetchIndustries();
  }, [dispatch]);

  const getSchemaForStep = (step: number) => {
    switch (step) {
      case 0: return step1Schema;
      case 1: return step2Schema;
      default: return yup.object().shape({});
    }
  };

  const { control, handleSubmit, formState: { errors }, trigger, reset } = useForm({
    resolver: yupResolver(getSchemaForStep(currentStep) as any),
    defaultValues: {
      companyName: '', website: '', companySize: '', industry: '', bio: '', location: '',
      companyLogo: null, coverImage: null, gstNumber: '', verifDoc: null,
      foundedDate: '', awards: [], fb_link: '', insta_link: '', linked_link: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      const company = initialData.company || initialData;
      reset({
        companyName: company.company_name || company.companyName || '',
        website: company.company_web_url || company.website || '',
        companySize: company.company_size || company.companySize || '',
        industry: company.industry_type || company.industry || '',
        bio: company.company_about || company.bio || '',
        location: company.office_location || company.location || '',
        companyLogo: company.company_logo ? { uri: company.company_logo } : null,
        coverImage: company.cover_img ? { uri: company.cover_img } : null,
        gstNumber: company.gst_no || company.gstNumber || '',
        verifDoc: company.company_docs ? { uri: company.company_docs, name: 'document.pdf' } : null,
        foundedDate: company.founded_date || company.foundedIn || '',
        awards: (company.awards || []).map((a: any) => ({
          title: a.award_title || a.title || '',
          date: a.award_date || a.date || a.year || '',
          description: a.desc || a.description || ''
        })),
        fb_link: company.fb_link || '',
        insta_link: company.insta_link || '',
        linked_link: company.linked_link || '',
      } as any);
    }
  }, [initialData, reset]);

  const handleNext = async (data: any) => {
    const isValid = await trigger();
    if (isValid) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
          companyName: data.companyName, website: data.website,
          companySize: data.companySize, industry: data.industry,
          bio: data.bio, location: data.location,
          companyLogo: data.companyLogo, coverImage: data.coverImage,
        };
      case 1:
        return {
          gstNumber: data.gstNumber, foundedDate: data.foundedDate,
          awards: data.awards, verifDoc: data.verifDoc,
          fb_link: data.fb_link, insta_link: data.insta_link,
          linked_link: data.linked_link,
        };
      default:
        return data;
    }
  };

  const stepTitles = [
    { title: 'Company Details', subtitle: 'Tell us about your organization', icon: '🏢' },
    { title: 'Verification', subtitle: 'Company verification info', icon: '✅' },
  ];

  const renderStep1 = () => (
    <View>
      <Controller control={control} name="companyLogo" render={({ field: { onChange, value } }) => (
        <UploadCard label="Company Logo (Optional)" type="image" value={value as any} onChange={onChange} error={errors.companyLogo?.message as string} />
      )} />
      <Controller control={control} name="coverImage" render={({ field: { onChange, value } }) => (
        <UploadCard label="Cover Image (Optional)" type="image" value={value as any} onChange={onChange} error={errors.coverImage?.message as string} />
      )} />
      <Controller control={control} name="companyName" render={({ field: { onChange, value } }) => (
        <CustomInput label="Company Name" placeholder="Tech Solutions Inc." value={value} onChangeText={onChange} error={errors.companyName?.message as string} />
      )} />
      <Controller control={control} name="location" render={({ field: { onChange, value } }) => (
        <CustomInput label="Office Location" placeholder="e.g. Bangalore, India" value={value} onChangeText={onChange} error={errors.location?.message as string} />
      )} />
      <Controller control={control} name="industry" render={({ field: { onChange, value } }) => (
        <DropdownInput label="Industry Type" value={value} options={industries} onSelect={onChange} error={errors.industry?.message as string} />
      )} />
      <Controller control={control} name="companySize" render={({ field: { onChange, value } }) => (
        <DropdownInput label="Company Size" value={value} options={['1-10', '11-50', '51-200', '201-500', '500+']} onSelect={onChange} error={errors.companySize?.message as string} />
      )} />
      <Controller control={control} name="website" render={({ field: { onChange, value } }) => (
        <CustomInput label="Company Website" placeholder="https://company.com" value={value} onChangeText={onChange} error={errors.website?.message as string} autoCapitalize="none" />
      )} />
      <Controller control={control} name="bio" render={({ field: { onChange, value } }) => (
        <CustomInput label="About Company" placeholder="Describe your company..." multiline numberOfLines={4} value={value} onChangeText={onChange} error={errors.bio?.message as string} />
      )} />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Controller control={control} name="gstNumber" render={({ field: { onChange, value } }) => (
        <CustomInput label="GST Number" placeholder="22AAAAA0000A1Z5" value={value} onChangeText={onChange} error={errors.gstNumber?.message as string} autoCapitalize="characters" />
      )} />
      <Controller control={control} name="foundedDate" render={({ field: { onChange, value } }) => (
        <>
          <TouchableOpacity onPress={() => setIsFoundedDatePickerOpen(true)} activeOpacity={0.8}>
            <View pointerEvents="none">
              <CustomInput label="Founded Date" placeholder="Select Date" value={value} editable={false} error={errors.foundedDate?.message as string} />
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            open={isFoundedDatePickerOpen}
            date={value && !isNaN(new Date(value).getTime()) ? new Date(value) : new Date()}
            mode="date"
            onConfirm={(selectedDate) => {
              setIsFoundedDatePickerOpen(false);
              const yyyy = selectedDate.getFullYear();
              const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const dd = String(selectedDate.getDate()).padStart(2, '0');
              const formattedDate = `${yyyy}-${mm}-${dd}`;
              onChange(formattedDate);
            }}
            onCancel={() => setIsFoundedDatePickerOpen(false)}
          />
        </>
      )} />

      {/* Awards Section */}
      <Controller control={control} name="awards" render={({ field: { onChange, value } }) => {
        const awardsList = (value || []) as AwardData[];
        return (
          <View style={styles.awardsContainer}>
            <View style={styles.awardsHeader}>
              <Text style={styles.awardsTitle}>Awards & Recognition (Optional)</Text>
              <TouchableOpacity style={styles.addAwardBtn} onPress={() => { setEditingAwardIndex(null); setIsAwardModalVisible(true); }}>
                <Plus size={RFValue(10)} color={Colors.white} />
                <Text style={styles.addAwardText}>Add</Text>
              </TouchableOpacity>
            </View>
            {awardsList.map((award, index) => (
              <View key={index} style={styles.awardCard}>
                <View style={styles.awardInfo}>
                  <Text style={styles.awardName}>{award.title}</Text>
                  <Text style={styles.awardDate}>{award.date}</Text>
                  <Text style={styles.awardDate}>{award.description}</Text>
                </View>
                <View style={styles.awardActions}>
                  <TouchableOpacity onPress={() => { setEditingAwardIndex(index); setIsAwardModalVisible(true); }} style={{ padding: wp('1%') }}>
                    <Edit2 size={RFValue(11)} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { const newAwards = [...awardsList]; newAwards.splice(index, 1); onChange(newAwards); }} style={{ padding: wp('1%') }}>
                    <Trash2 size={RFValue(11)} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <AddAwardModal
              isVisible={isAwardModalVisible}
              onClose={() => setIsAwardModalVisible(false)}
              initialData={editingAwardIndex !== null ? awardsList[editingAwardIndex] : null}
              onSave={(award) => {
                const newAwards = [...awardsList];
                if (editingAwardIndex !== null) {
                  newAwards[editingAwardIndex] = award;
                } else {
                  newAwards.push(award);
                }
                onChange(newAwards);
                setIsAwardModalVisible(false);
              }}
            />
          </View>
        );
      }} />

      <Controller control={control} name="fb_link" render={({ field: { onChange, value } }) => (
        <CustomInput label="Facebook URL (Optional)" placeholder="https://facebook.com/yourcompany" value={value || ""} onChangeText={onChange} error={errors.fb_link?.message as string} autoCapitalize="none" />
      )} />
      <Controller control={control} name="insta_link" render={({ field: { onChange, value } }) => (
        <CustomInput label="Instagram URL (Optional)" placeholder="https://instagram.com/yourcompany" value={value || ""} onChangeText={onChange} error={errors.insta_link?.message as string} autoCapitalize="none" />
      )} />
      <Controller control={control} name="linked_link" render={({ field: { onChange, value } }) => (
        <CustomInput label="LinkedIn URL (Optional)" placeholder="https://linkedin.com/company/yourcompany" value={value || ""} onChangeText={onChange} error={errors.linked_link?.message as string} autoCapitalize="none" />
      )} />

      <Controller control={control} name="verifDoc" render={({ field: { onChange, value } }) => (
        <UploadCard label="Verification Document" type="document" value={value as any} onChange={onChange} error={errors.verifDoc?.message as string} />
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
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <CustomButton
          title={isLastStep ? 'Finish Profile ✨' : 'Save & Continue'}
          onPress={handleSubmit(handleNext)}
          loading={saving}
          style={styles.nextBtn}
        />
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    backgroundColor: Colors.white,
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: wp('3%'),
  },
  stepIcon: {
    fontSize: RFValue(22),
  },
  stepTitle: {
    ...Typography.h3,
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

  // Awards styles
  awardsContainer: {
    marginBottom: hp('2%'),
  },
  awardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  awardsTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  addAwardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    gap: wp('1%'),
  },
  addAwardText: {
    color: Colors.white,
    fontSize: RFValue(10),
    fontWeight: '600',
  },
  awardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: wp('3%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: hp('1%'),
  },
  awardInfo: { flex: 1 },
  awardName: {
    fontSize: RFValue(10.5),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: hp('0.3%'),
  },
  awardDate: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
  },
  awardActions: {
    flexDirection: 'row',
    gap: wp('2%'),
  },
  skipBtn: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('6%'),
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    width: '100%',
  },
  skipBtnText: {
    color: Colors.textSecondary,
    ...Typography.button,
  },
});

export default ManagerProfileSteps;
