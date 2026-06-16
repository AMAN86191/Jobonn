import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { XCircle, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import CustomInput from '../inputs/CustomInput';

export interface ProfileData {
  recruiterName: string;
  companyName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  companySize: string;
  gstNumber: string;
  website: string;
  bio: string;
}

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData,
}) => {
  const [recruiterName, setRecruiterName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');

  // Sync state when modal opens/changes
  useEffect(() => {
    if (isVisible && initialData) {
      setRecruiterName(initialData.recruiterName || '');
      setCompanyName(initialData.companyName || '');
      setRole(initialData.role || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setLocation(initialData.location || '');
      setIndustry(initialData.industry || '');
      setCompanySize(initialData.companySize || '');
      setGstNumber(initialData.gstNumber || '');
      setWebsite(initialData.website || '');
      setBio(initialData.bio || '');
    }
  }, [isVisible, initialData]);

  const handleSave = () => {
    if (!recruiterName.trim() || !companyName.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Recruiter Name, Company Name and Email cannot be empty.');
      return;
    }

    onSave({
      recruiterName,
      companyName,
      role,
      email,
      phone,
      location,
      industry,
      companySize,
      gstNumber,
      website,
      bio,
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { maxHeight: hp('85%') }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Professional Profile</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <XCircle size={RFValue(20)} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Scrolling Fields */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalSectionTitle}>Recruiter Details</Text>
            
            <CustomInput
              label="Full Name"
              value={recruiterName}
              onChangeText={setRecruiterName}
              placeholder="e.g. Tushar Mehra"
            />

            <CustomInput
              label="Job Title"
              value={role}
              onChangeText={setRole}
              placeholder="e.g. Lead Recruiter"
            />

            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="e.g. hr@company.com"
            />

            <CustomInput
              label="Contact Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="e.g. +91 XXXXX XXXXX"
            />

            <Text style={styles.modalSectionTitle}>Company Details</Text>

            <CustomInput
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="e.g. Tech Solutions"
            />

            <CustomInput
              label="HQ Location"
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Bangalore, India"
            />

            <CustomInput
              label="Industry Sector"
              value={industry}
              onChangeText={setIndustry}
              placeholder="e.g. IT, Design, Finance"
            />

            <CustomInput
              label="Company Scale"
              value={companySize}
              onChangeText={setCompanySize}
              placeholder="e.g. 50-100 Employees"
            />

            <CustomInput
              label="GST Number"
              value={gstNumber}
              onChangeText={setGstNumber}
              placeholder="e.g. GST1234567890"
            />

            <CustomInput
              label="Web Address"
              value={website}
              onChangeText={setWebsite}
              placeholder="e.g. company.com"
            />

            <CustomInput
              label="About Company"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              placeholder="Enter quick summary about your organization..."
            />
          </ScrollView>

          {/* Footer Controls */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <CheckCircle2 color={Colors.white} size={wp('4%')} />
              <Text style={styles.confirmBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 35, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    width: '100%',
    padding: wp('5.5%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: hp('1%'),
  },
  modalTitle: {
    fontSize: RFValue(13.5),
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalScroll: {
    paddingBottom: hp('4%'),
  },
  modalSectionTitle: {
    fontSize: RFValue(10.5),
    fontWeight: '800',
    color: Colors.primary,
    marginTop: hp('1.5%'),
    marginBottom: hp('0.8%'),
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: wp('3%'),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: hp('1.5%'),
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: RFValue(11),
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.5,
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    gap: wp('1.5%'),
  },
  confirmBtnText: {
    fontSize: RFValue(11),
    color: Colors.white,
    fontWeight: '800',
  },
});

export default EditProfileModal;
