import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react-native';
import CustomInput from '../../components/inputs/CustomInput';
import MainManagerHeader from '../../components/Manager_component/MainManagerHeader';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompleteRegistrationSlice } from '../../redux/AuthSlice';
import { getProfileCompleteness } from '../../utils/profileCompleteness';
import UploadCard from '../../components/forms/UploadCard';

const ManagerEditProfileScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  // Get initial user data from route
  const { user } = route.params || { user: { manager_profile: {} } };

  const [saving, setSaving] = useState(false);
  
  const [companyLogo, setCompanyLogo] = useState<any>(
    user?.manager_profile?.companyLogo ? { uri: user.manager_profile.companyLogo } : null
  );
  const [coverImage, setCoverImage] = useState<any>(
    user?.manager_profile?.coverImage ? { uri: user.manager_profile.coverImage } : null
  );

  // Initialize State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    jobTitle: user?.manager_profile?.jobTitle || '',
    companyName: user?.manager_profile?.companyName || '',
    website: user?.manager_profile?.website || '',
    bio: user?.manager_profile?.bio || '',
    industry: user?.manager_profile?.industry || '',
    companySize: user?.manager_profile?.companySize || '',
    gstNumber: user?.manager_profile?.gstNumber || '',
    foundedIn: user?.manager_profile?.foundedIn || '',
    headquarters: user?.manager_profile?.headquarters || '',
    location: user?.manager_profile?.location || '',
  });

  const [awards, setAwards] = useState(
    (user?.manager_profile?.awards || []).map((a: any) => ({
      title: a.title || '',
      year: a.year || a.date || '',
      description: a.description || a.desc || ''
    }))
  );

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateAward = (index: number, key: string, value: string) => {
    const newAwards = [...awards];
    newAwards[index] = { ...newAwards[index], [key]: value };
    setAwards(newAwards);
  };

  const addAward = () => {
    setAwards([...awards, { title: '', year: '', description: '' }]);
  };

  const removeAward = (index: number) => {
    const newAwards = awards.filter((_: any, i: number) => i !== index);
    setAwards(newAwards);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      let companyId = '';
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          companyId = parsed.company_id || parsed.company?.id || parsed.id || '';
        }
      } catch (err) {
        console.log('Error reading company_id from AsyncStorage', err);
      }

      const formDataPayload = new FormData();
      formDataPayload.append('company_id', String(companyId || ''));
      formDataPayload.append('company_name', formData.companyName || '');
      formDataPayload.append('office_location', formData.location || '');
      formDataPayload.append('industry_type', formData.industry || '');
      formDataPayload.append('company_size', formData.companySize || '');
      formDataPayload.append('company_web_url', formData.website || '');
      formDataPayload.append('company_about', formData.bio || '');
      formDataPayload.append('gst_no', formData.gstNumber || '');
      formDataPayload.append('founded_date', formData.foundedIn || '');
      
      awards.forEach((award: any, index: number) => {
        formDataPayload.append(`awards[${index}][award_title]`, award.title || '');
        formDataPayload.append(`awards[${index}][award_date]`, award.year || '');
        formDataPayload.append(`awards[${index}][desc]`, award.description || '');
      });

      if (companyLogo && companyLogo.uri && (companyLogo.uri.startsWith('file:') || companyLogo.uri.startsWith('content:') || companyLogo.uri.startsWith('ph:'))) {
        formDataPayload.append('company_logo', {
          uri: companyLogo.uri,
          name: companyLogo.name || 'logo.png',
          type: companyLogo.type || 'image/png'
        } as any);
      }

      if (coverImage && coverImage.uri && (coverImage.uri.startsWith('file:') || coverImage.uri.startsWith('content:') || coverImage.uri.startsWith('ph:'))) {
        formDataPayload.append('cover_img', {
          uri: coverImage.uri,
          name: coverImage.name || 'cover.jpg',
          type: coverImage.type || 'image/jpeg'
        } as any);
      }

      console.log('Submitting updated company registration payload:', formDataPayload);

      const res = await dispatch(CompleteRegistrationSlice(formDataPayload) as any).unwrap();
      console.log('Update profile response:', res);

      // Save updated company in AsyncStorage
      if (res?.company) {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const completeness = getProfileCompleteness(res.company);
          const newUserData = {
            ...parsed,
            ...(res.company.user || {}),
            company: res.company,
            profile_completed: completeness.isComplete,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
        }
      }

      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error: any) {
      console.log('Error updating profile:', error);
      Alert.alert('Error', error?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content"   />
      
  <MainManagerHeader title="Edit Profile" subtitle='Manage your company and recruitment details'  />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, hp('5%')) }]}
        >
          {/* Recruiter Details */}
          <Text style={styles.sectionTitle}>Recruiter Details</Text>
          <View style={styles.card}>
            <CustomInput label="Full Name" value={formData.name} onChangeText={(t: string) => updateField('name', t)} placeholder="Enter full name" />
            <CustomInput label="Job Title" value={formData.jobTitle} onChangeText={(t: string) => updateField('jobTitle', t)} placeholder="e.g. Lead Recruiter" />
            <CustomInput label="Email Address" value={formData.email} onChangeText={(t: string) => updateField('email', t)} placeholder="Enter email address" />
            <CustomInput label="Phone Number" value={formData.phone} onChangeText={(t: string) => updateField('phone', t)} placeholder="Enter phone number" />
          </View>

          {/* About Company */}
          <Text style={styles.sectionTitle}>About Company</Text>
          <View style={styles.card}>
            <UploadCard
              label="Company Logo"
              type="image"
              value={companyLogo}
              onChange={(logo: any) => setCompanyLogo(logo)}
              error=""
            />
            <UploadCard
              label="Cover Image"
              type="image"
              value={coverImage}
              onChange={(cover: any) => setCoverImage(cover)}
              error=""
            />
            <CustomInput label="Company Name" value={formData.companyName} onChangeText={(t: string) => updateField('companyName', t)} placeholder="Enter company name" />
            <CustomInput label="Website" value={formData.website} onChangeText={(t: string) => updateField('website', t)} placeholder="e.g. techmark.in" />
            <CustomInput 
              label="Company Bio" 
              value={formData.bio} 
              onChangeText={(t: string) => updateField('bio', t)} 
              placeholder="Write a short description..." 
              multiline={true} 
            />
          </View>

          {/* Company Information */}
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.card}>
            <CustomInput label="Industry" value={formData.industry} onChangeText={(t: string) => updateField('industry', t)} placeholder="e.g. IT & Enterprise Software" />
            <CustomInput label="Company Size" value={formData.companySize} onChangeText={(t: string) => updateField('companySize', t)} placeholder="e.g. 200 - 500 Employees" />
            <CustomInput label="GST Number" value={formData.gstNumber} onChangeText={(t: string) => updateField('gstNumber', t)} placeholder="Enter GST Number" />
            <CustomInput label="Founded In" value={formData.foundedIn} onChangeText={(t: string) => updateField('foundedIn', t)} placeholder="e.g. 2018" />
            <CustomInput label="Headquarters" value={formData.headquarters} onChangeText={(t: string) => updateField('headquarters', t)} placeholder="e.g. Bangalore, India" />
            <CustomInput label="Primary Location" value={formData.location} onChangeText={(t: string) => updateField('location', t)} placeholder="e.g. Bangalore, KA, India" />
          </View>

          {/* Awards & Recognitions */}
          <View style={styles.awardsHeaderRow}>
            <Text style={styles.sectionTitle}>Awards & Recognitions</Text>
            <TouchableOpacity style={styles.addAwardBtn} onPress={addAward}>
              <Plus size={RFValue(10)} color={Colors.white} />
              <Text style={styles.addAwardText}>Add Award</Text>
            </TouchableOpacity>
          </View>

          {awards.map((award: any, index: number) => (
            <View key={index} style={styles.awardCard}>
              <View style={styles.awardHeader}>
                <Text style={styles.awardTitle}>Award #{index + 1}</Text>
                {awards.length > 1 && (
                  <TouchableOpacity onPress={() => removeAward(index)}>
                    <Trash2 size={RFValue(12)} color={Colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
              <CustomInput 
                label="Award Title" 
                value={award.title} 
                onChangeText={(t: string) => updateAward(index, 'title', t)} 
                placeholder="e.g. Valued CEO" 
              />
              <CustomInput 
                label="Year" 
                value={award.year} 
                onChangeText={(t: string) => updateAward(index, 'year', t)} 
                placeholder="e.g. 2023" 
              />
              <CustomInput 
                label="Description" 
                value={award.description} 
                onChangeText={(t: string) => updateAward(index, 'description', t)} 
                placeholder="Enter description..." 
                multiline={true} 
              />
            </View>
          ))}

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
            onPress={handleSave}
            disabled={saving}
          >
            <CheckCircle2 color={Colors.white} size={RFValue(12)} />
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FC' },
  content: {
    paddingHorizontal: wp('2%'),
  },
  sectionTitle: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp('2%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  awardsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  addAwardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: 8,
    gap: wp('1%'),
  },
  addAwardText: {
    color: Colors.white,
    fontSize: RFValue(9),
    fontWeight: '700',
  },
  awardCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  awardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  awardTitle: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.8%'),
    borderRadius: 12,
    marginTop: hp('2%'),
    gap: wp('2%'),
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: RFValue(12),
    fontWeight: '800',
  },
});

export default ManagerEditProfileScreen;
