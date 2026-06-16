import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeft, FileText,  CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomInput from '../../components/inputs/CustomInput';
import CustomButton from '../../components/buttons/CustomButton';
import UploadCard, { FileData } from '../../components/forms/UploadCard';
import Pdf from 'react-native-pdf';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';

const TOTAL_STEPS = 3;

const ApplyJobFlow = ({ navigation }: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isset = useSafeAreaInsets()

  // Form State
  const [resumeFile, setResumeFile] = useState<FileData | null>({
    uri: '../assets/ticket.pdf', // In a real app, this might be a pre-filled URI
    name: 'Resume.pdf',
    type: 'application/pdf'
  });
  const [personalDetails, setPersonalDetails] = useState({
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '+91 9876543210',
    city: 'Bangalore'
  });
  const [professionalDetails, setProfessionalDetails] = useState({
    title: 'Frontend Developer',
    experience: '3 Years',
    expectedSalary: '10LPA',
    noticePeriod: '30 Days'
  });
  const [questions, setQuestions] = useState({
    whyHire: '',
    relocate: '',
    portfolio: 'https://github.com/amitsharma',
    linkedin: 'https://linkedin.com/in/amitsharma'
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitApplication();
    }
  };

  const submitApplication = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('ApplicationSuccess');
    }, 1500);
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

      <TouchableOpacity style={[styles.resumeCard, styles.resumeCardActive]}>
        <FileText color={Colors.primary} size={wp('6%')} />
        <View style={styles.resumeInfo}>
          <Text style={styles.resumeName}>{resumeFile?.name}</Text>
          <Text style={styles.resumeUpdate}>Default Resume</Text>
        </View>
        <CheckCircle2 color={Colors.primary} size={wp('5%')} />
      </TouchableOpacity>

      <View style={{ marginTop: hp('2%') }}>
        <UploadCard
          label="Or Upload New Resume"
          type="document"
          value={resumeFile}
          onChange={setResumeFile}
          placeholder="Tap to upload a different resume"
        />
      </View>
    </View>
  );

  // const renderPersonalDetails = () => (
  //   <View style={styles.stepContent}>
  //     <Text style={styles.stepTitle}>Personal Details</Text>
  //     <CustomInput 
  //       label="Full Name" 
  //       value={personalDetails.name} 
  //       onChangeText={(text) => setPersonalDetails({...personalDetails, name: text})} 
  //     />
  //     <CustomInput 
  //       label="Email Address" 
  //       value={personalDetails.email} 
  //       keyboardType="email-address"
  //       onChangeText={(text) => setPersonalDetails({...personalDetails, email: text})} 
  //     />
  //     <CustomInput 
  //       label="Phone Number" 
  //       value={personalDetails.phone} 
  //       keyboardType="phone-pad"
  //       onChangeText={(text) => setPersonalDetails({...personalDetails, phone: text})} 
  //     />
  //     <CustomInput 
  //       label="Current City" 
  //       value={personalDetails.city} 
  //       onChangeText={(text) => setPersonalDetails({...personalDetails, city: text})} 
  //     />
  //   </View>
  // );

  const renderProfessionalDetails = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Professional Details</Text>
      <CustomInput
        label="Current Job Title"
        value={professionalDetails.title}
        onChangeText={(text) => setProfessionalDetails({ ...professionalDetails, title: text })}
      />
      <CustomInput
        label="Total Experience"
        value={professionalDetails.experience}
        onChangeText={(text) => setProfessionalDetails({ ...professionalDetails, experience: text })}
      />
      <CustomInput
        label="Expected Salary"
        value={professionalDetails.expectedSalary}
        onChangeText={(text) => setProfessionalDetails({ ...professionalDetails, expectedSalary: text })}
      />
      <CustomInput
        label="Notice Period"
        value={professionalDetails.noticePeriod}
        onChangeText={(text) => setProfessionalDetails({ ...professionalDetails, noticePeriod: text })}
      />
    </View>
  );

  const renderQuestions = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Additional Questions</Text>
      <CustomInput
        label="Why should we hire you?"
        value={questions.whyHire}
        onChangeText={(text) => setQuestions({ ...questions, whyHire: text })}
        multiline
        numberOfLines={3}
      />
      <CustomInput
        label="Are you available to relocate?"
        value={questions.relocate}
        onChangeText={(text) => setQuestions({ ...questions, relocate: text })}
      />
      <CustomInput
        label="Portfolio Link"
        value={questions.portfolio}
        onChangeText={(text) => setQuestions({ ...questions, portfolio: text })}
      />
      <CustomInput
        label="LinkedIn Profile"
        value={questions.linkedin}
        onChangeText={(text) => setQuestions({ ...questions, linkedin: text })}
      />
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
        <Text style={styles.reviewText}>{resumeFile?.name}</Text>

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
          <TouchableOpacity onPress={() => setCurrentStep(2)}>
            {/* <Text style={styles.editLink}>Edit</Text> */}
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>{personalDetails.name} • {personalDetails.phone}</Text>
        <Text style={styles.reviewText}>{personalDetails.email}</Text>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Professional Details</Text>
          <TouchableOpacity onPress={() => setCurrentStep(3)}>
            {/* <Text style={styles.editLink}>Edit</Text> */}
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>{professionalDetails.title} ({professionalDetails.experience})</Text>
        <Text style={styles.reviewText}>Expected: {professionalDetails.expectedSalary} • Notice: {professionalDetails.noticePeriod}</Text>
      </View>
    </View>
  );

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color={Colors.textPrimary} size={RFValue(14)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Job</Text>
        <View style={{ width: wp('10%') }} />
      </View>

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentStep === 1 && renderResumeSelection()}
        {/* {currentStep === 2 && renderProfessionalDetails()} */}
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
