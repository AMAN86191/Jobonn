import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../components/inputs/CustomInput';
import CustomButton from '../../../components/buttons/CustomButton';
import { Colors } from '../../../theme/Colors';
import { Typography } from '../../../theme/Typography';
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, { FadeInDown } from 'react-native-reanimated';

const signupSchema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().min(10, 'Invalid phone number').required('Phone is required'),
});

interface CandidateSignupFlowProps {
  onComplete: (data: any) => void;
  loading?: boolean;
}

const CandidateSignupFlow: React.FC<CandidateSignupFlowProps> = ({ onComplete, loading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
    }
  });

  const onSubmit = (data: any) => {
    onComplete({
      role: 'candidate',
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.headerSection}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Just 3 fields to get started. You can complete your profile after signup.
        </Text>
      </Animated.View>

      {/* Form */}
      <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.formSection}>
        <Controller control={control} name="full_name" render={({ field: { onChange, value } }) => (
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={value}
            onChangeText={onChange}
            error={errors.full_name?.message as string}
          />
        )} />
        <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
          <CustomInput
            label="Email Address"
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message as string}
          />
        )} />
        <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
          <CustomInput
            label="Phone Number"
            placeholder="Enter your 10-digit mobile number"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            error={errors.phone?.message as string}
            maxLength={10}
          />
        )} />
      </Animated.View>

      {/* Info Note */}
      {/* <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          We'll verify your email with OTP, then you'll set a password. Quick & easy!
        </Text>
      </Animated.View> */}

      {/* Submit Button */}
      <Animated.View entering={FadeInDown.duration(400).delay(500)}>
        <CustomButton
          title="Continue"
          onPress={handleSubmit(onSubmit)}
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
    marginBottom: hp('0.5%'),
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: hp('2.5%'),
  },
  formSection: {
    marginBottom: hp('1%'),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: Colors.info + '20',
  },
  infoIcon: {
    fontSize: RFValue(14),
    marginRight: wp('3%'),
  },
  infoText: {
    ...Typography.caption,
    color: Colors.info,
    flex: 1,
    fontWeight: '500',
    lineHeight: hp('2%'),
  },
});

export default CandidateSignupFlow;
