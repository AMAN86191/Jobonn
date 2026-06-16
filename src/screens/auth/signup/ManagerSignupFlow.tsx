import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomInput from '../../../components/inputs/CustomInput';
import CustomButton from '../../../components/buttons/CustomButton';
import { Colors } from '../../../theme/Colors';
import { Typography } from '../../../theme/Typography';
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CheckSquare, Square } from 'lucide-react-native';

interface ManagerSignupFlowProps {
  onComplete: (data: any) => void;
  loading?: boolean;
}

const ManagerSignupFlow: React.FC<ManagerSignupFlowProps> = ({ onComplete, loading }) => {
  const [isWhatsappSame, setIsWhatsappSame] = useState(false);

  const [recruiterName, setRecruiterName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!recruiterName) newErrors.recruiterName = 'Full name is required';
    if (!designation) newErrors.designation = 'Job title is required';
    if (!email) newErrors.email = 'Email is required';
    if (!phone) newErrors.phone = 'Phone is required';
    if (!whatsappNumber) newErrors.whatsappNumber = 'WhatsApp number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onComplete({
      role: 'company',
      full_name: recruiterName,
      email,
      phone,
      w_phone: whatsappNumber,
      job_title: designation,
    });
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (isWhatsappSame) {
      setWhatsappNumber(text);
    }
  };

  const toggleWhatsappSame = () => {
    const newValue = !isWhatsappSame;
    setIsWhatsappSame(newValue);
    if (newValue) {
      setWhatsappNumber(phone);
    } else {
      setWhatsappNumber('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.headerSection}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Quick setup — company details can be added after signup.
        </Text>
      </Animated.View>

      {/* Form */}
      <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.formSection}>
        <CustomInput
          label="Full Name"
          placeholder="Enter your full name"
          value={recruiterName}
          onChangeText={setRecruiterName}
          error={errors.recruiterName}
        />
        <CustomInput
          label="Job Title / Post"
          placeholder="e.g. HR Manager / CEO"
          value={designation}
          onChangeText={setDesignation}
          error={errors.designation}
        />
        <CustomInput
          label="Email Address"
          placeholder="Enter your official email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <CustomInput
          label="Phone Number"
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={handlePhoneChange}
          error={errors.phone}
          maxLength={10}
        />

        <TouchableOpacity style={styles.checkboxRow} onPress={toggleWhatsappSame}>
          {isWhatsappSame
            ? <CheckSquare size={RFValue(12)} color={Colors.primary} />
            : <Square size={RFValue(12)} color={Colors.textSecondary} />
          }
          <Text style={styles.checkboxLabel}>WhatsApp number is same as phone number</Text>
        </TouchableOpacity>

        <CustomInput
          label="WhatsApp Number"
          placeholder="Enter WhatsApp number"
          keyboardType="phone-pad"
          value={whatsappNumber}
          onChangeText={setWhatsappNumber}
          error={errors.whatsappNumber}
          editable={!isWhatsappSame}
          maxLength={10}
        />
      </Animated.View>

      {/* Submit Button */}
      <Animated.View entering={FadeInDown.duration(400).delay(500)}>
        <CustomButton
          title="Continue"
          onPress={onSubmit}
          loading={loading}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    marginBottom: hp('3%'),
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: hp('0.3%'),
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: hp('2.5%'),
  },
  formSection: {
    marginBottom: hp('1%'),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    gap: wp('2%'),
  },
  checkboxLabel: {
    fontSize: RFValue(10),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: Colors.warning + '20',
  },
  infoIcon: {
    fontSize: RFValue(14),
    marginRight: wp('3%'),
  },
  infoText: {
    ...Typography.caption,
    color: Colors.warning,
    flex: 1,
    fontWeight: '500',
    lineHeight: hp('2%'),
  },
});

export default ManagerSignupFlow;
