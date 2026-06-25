import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar, ToastAndroid, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeft, FileText, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomInput from '../../components/inputs/CustomInput';
import CustomButton from '../../components/buttons/CustomButton';
import UploadCard, { FileData } from '../../components/forms/UploadCard';
import Pdf from 'react-native-pdf';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';
import { logJobApply } from '../../services/firebase/analytics';
import { useDispatch } from 'react-redux';
import { getProfileSlice, updateProfileSlice } from '../../redux/CandidateProfileSlice';
import { applyJobSlice } from '../../redux/CandidateJobSlice';
import CommanManagerHeader from '../../components/Manager_component/CommanManagerHeader';

const TOTAL_STEPS = 3;

const ApplyJobFlow = ({ navigation, route }: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isset = useSafeAreaInsets();
  const job = route?.params?.job;

  const dispatch = useDispatch<any>();
  const [profile, setProfile] = useState<any>(null);

  // Form State
  const [resumeFile, setResumeFile] = useState<FileData | null>(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [professionalDetails, setProfessionalDetails] = useState({
    title: '',
    experience: '',
    expectedSalary: '',
    noticePeriod: ''
  });

  // Dynamic additional questions mapping
  const additionalQuestions = useMemo(() => {
    const list = job?.additional_questions || job?.question || job?.rawJob?.question || job?.rawJob?.additional_questions || [];
    if (Array.isArray(list)) {
      return list.map((q: any, index: number) => {
        if (typeof q === 'string') {
          return { id: String(index), question: q };
        }
        if (q && typeof q === 'object') {
          return {
            id: String(q.id || index),
            question: q.question || q.question_text || q.text || ''
          };
        }
        return null;
      }).filter(Boolean);
    }
    return [];
  }, [job]);

  // Load candidate profile from cache or backend API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await dispatch(getProfileSlice()).unwrap();
        console.log('Loaded profile in ApplyJobFlow successfully:', response);
        const candidate = response?.candidate || response;
        if (candidate) {
          setProfile(candidate);
          const docs = candidate.docs || {};
          const userObj = candidate.user || {};
          const personal = candidate.personal_detail || {};
          const professional = candidate.professional_detail || {};
          const career = candidate.career_preference || {};

          // Pre-fill Resume file
          const resumeUrl = docs.resume || candidate.resume || '';
          if (resumeUrl) {
            setResumeFile({
              uri: resumeUrl.startsWith('http') ? resumeUrl : `https://admin.jobonn.in/storage/${resumeUrl}`,
              name: resumeUrl.split('/').pop() || 'Resume.pdf',
              type: 'application/pdf'
            });
          }

          // Pre-fill links
          setPortfolioLink(docs.portfolio_link || candidate.portfolio_link || candidate.portfolio || '');
          setLinkedinLink(candidate.linkedin_link || candidate.linkedin || '');

          setPersonalDetails({
            name: userObj.name || candidate.name || '',
            email: userObj.email || candidate.email || '',
            phone: userObj.phone || candidate.phone || '',
            city: personal.city || candidate.city || ''
          });

          setProfessionalDetails({
            title: professional.job_title || candidate.designation || '',
            experience: (professional.exp_years != null) ? `${professional.exp_years} Yrs ${professional.exp_months || 0} Mos` : '',
            expectedSalary: career.expected_salary ? `${career.expected_salary} LPA` : '',
            noticePeriod: career.notice_period || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile in ApplyJobFlow:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [dispatch]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitApplication();
    }
  };

  const handleResumeChange = async (file: FileData | null) => {
    setResumeFile(file);
    if (file && file.uri) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('candidate_id', String(profile?.id || ''));
        formData.append('portfolio_link', portfolioLink);

        formData.append('resume', {
          uri: file.uri,
          name: file.name || 'resume.pdf',
          type: file.type || 'application/pdf',
        } as any);

        console.log('Uploading new resume in ApplyJobFlow...', file);
        const res = await dispatch(updateProfileSlice(formData)).unwrap();
        console.log('Resume updated successfully in ApplyJobFlow:', res);
        ToastAndroid.show('Resume updated on profile', ToastAndroid.SHORT);
      } catch (err: any) {
        console.error('Failed to update resume:', err);
        ToastAndroid.show('Failed to update resume', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    }
  };

  const submitApplication = async () => {
    if (!resumeFile) {
      Alert.alert('Error', 'Please select or upload a resume to apply.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        job_id: Number(job?.id),
        portfolio_link: portfolioLink,
        linkedin_link: linkedinLink,
        answers: answers
      };

      console.log('Submitting job application...', payload);
      const response = await dispatch(applyJobSlice(payload)).unwrap();
      console.log('Job applied successfully:', response);

      if (job) {
        logJobApply(job.id, job.title);
      }
      navigation.replace('ApplicationSuccess', { job });
    } catch (err: any) {
      console.error('Apply job failed:', err);
      Alert.alert('Application Failed', err?.message || err?.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[...Array(TOTAL_STEPS)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i + 1 <= currentStep ? styles.stepDotActive : null
          ]}
        />
      ))}
    </View>
  );

  const renderResumeSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Resume</Text>

      {resumeFile ? (
        <TouchableOpacity style={[styles.resumeCard, styles.resumeCardActive]}>
          <FileText color={Colors.primary} size={wp('6%')} />
          <View style={styles.resumeInfo}>
            <Text style={styles.resumeName}>{resumeFile.name}</Text>
            <Text style={styles.resumeUpdate}>Default Resume</Text>
          </View>
          <CheckCircle2 color={Colors.primary} size={wp('5%')} />
        </TouchableOpacity>
      ) : (
        <Text style={[styles.resumeUpdate, { marginBottom: hp('2%'), fontSize: RFValue(10) }]}>
          No default resume found. Please upload one below.
        </Text>
      )}

      <View style={{ marginTop: hp('2%') }}>
        <UploadCard
          label="Or Upload New Resume"
          type="document"
          value={resumeFile}
          onChange={handleResumeChange}
          placeholder="Tap to upload a different resume"
        />
      </View>
    </View>
  );

  const renderQuestions = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Application Info & Questions</Text>

      <CustomInput
        label="Portfolio Link"
        value={portfolioLink}
        onChangeText={setPortfolioLink}
        placeholder="https://portfolio.com"
      />
      <CustomInput
        label="LinkedIn Profile"
        value={linkedinLink}
        onChangeText={setLinkedinLink}
        placeholder="https://linkedin.com/in/username"
      />

      {additionalQuestions.length > 0 && (
        <View style={{ marginTop: hp('2%') }}>
          <Text style={[styles.stepTitle, { fontSize: RFValue(11), marginBottom: hp('1.5%') }]}>
            Job Questions
          </Text>
          {additionalQuestions.map((q: any) => (
            <CustomInput
              key={q.id}
              label={q.question}
              value={answers[q.id] || ''}
              onChangeText={(text) => setAnswers(prev => ({ ...prev, [q.id]: text }))}
              placeholder="Your answer here..."
              multiline
              numberOfLines={3}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Resume</Text>
          <TouchableOpacity onPress={() => setCurrentStep(1)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>{resumeFile?.name || 'No resume uploaded'}</Text>

        {resumeFile?.uri && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.miniPdfPreview}>
            <Pdf
              source={{ uri: resumeFile.uri, cache: true }}
              style={styles.pdfPreview}
              singlePage={true}
              onError={(error) => console.log('Review PDF Load Error:', error)}
            />
          </Animated.View>
        )}
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Personal Details</Text>
        </View>
        <Text style={styles.reviewText}>{personalDetails.name || 'N/A'} • {personalDetails.phone || 'N/A'}</Text>
        <Text style={styles.reviewText}>{personalDetails.email || 'N/A'}</Text>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Professional Details</Text>
        </View>
        <Text style={styles.reviewText}>{professionalDetails.title || 'N/A'} ({professionalDetails.experience || 'No Experience'})</Text>
        <Text style={styles.reviewText}>Expected: {professionalDetails.expectedSalary || 'N/A'} • Notice: {professionalDetails.noticePeriod || 'N/A'}</Text>
      </View>

      {additionalQuestions.length > 0 && (
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>Answers to Job Questions</Text>
            <TouchableOpacity onPress={() => setCurrentStep(2)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          {additionalQuestions.map((q: any) => (
            <View key={q.id} style={{ marginBottom: hp('1%') }}>
              <Text style={[styles.reviewText, { fontWeight: '700', color: Colors.textPrimary }]}>Q: {q.question}</Text>
              <Text style={styles.reviewText}>A: {answers[q.id] || 'Not answered'}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <CommanManagerHeader
        title="Apply for Job"
        navigation={navigation}
        onBack={() => navigation.goBack()}
      />

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentStep === 1 && renderResumeSelection()}
        {currentStep === 2 && renderQuestions()}
        {currentStep === 3 && renderReview()}

        <View style={{ height: hp('10%') }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: isset.bottom }]}>
        <CustomButton
          title={currentStep === TOTAL_STEPS ? "Submit Application" : "Next"}
          onPress={handleNext}
          loading={loading}
        />
      </View>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  iconBtn: {
    padding: wp('2%'),
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    ...Typography.body,
    fontFamily: 'Mulish-Bold',
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('2%'),
    paddingVertical: hp('2%'),
  },
  stepDot: {
    height: hp('0.8%'),
    width: wp('12%'),
    backgroundColor: Colors.border,
    borderRadius: wp('1%'),
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: wp('5%'),
  },
  stepContent: {
    marginTop: hp('1%'),
  },
  stepTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: hp('3%'),
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: hp('2%'),
  },
  resumeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  resumeInfo: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  resumeName: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resumeUpdate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: hp('0.5%'),
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: hp('2%'),
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  reviewTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  editLink: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  reviewText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: hp('0.5%'),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  miniPdfPreview: {
    height: hp('15%'),
    width: '100%',
    backgroundColor: '#F8F9FA',
    marginTop: hp('1%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pdfPreview: {
    flex: 1,
    width: '100%',
  },
});

export default ApplyJobFlow;
