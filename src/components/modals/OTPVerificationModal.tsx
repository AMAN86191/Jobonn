import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Pressable, ScrollView
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { X } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../buttons/CustomButton';

interface OTPVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => void;
  loading?: boolean;
  context?: 'login' | 'forgot' | 'signup';
  externalError?: string;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isVisible,
  onClose,
  email,
  onVerify,
  loading: externalLoading,
  context = 'forgot',
  externalError
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<TextInput[]>([]);

  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  useEffect(() => {
    if (isVisible) {
      setOtp(['', '', '', '']);
      setError('');
      // Auto focus first input when modal opens
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 500);
    }
  }, [isVisible]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) inputs.current[index + 1]?.focus();
    if (newOtp.every(v => v !== '')) setError('');
    if (externalError) {
      // We can't clear externalError directly since it's a prop, 
      // but we use internal error as priority for local validation
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.some(v => !v)) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }
    setError('');
    
    const otpString = otp.join('');
    if (onVerify) {
      onVerify(otpString);
    } else {
      // Default behavior if onVerify isn't provided (for testing)
      setInternalLoading(true);
      setTimeout(() => {
        setInternalLoading(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalInner}>
              <View style={styles.header}>
                <View style={styles.indicator} />
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <X color={Colors.textSecondary} size={wp('5%')} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconEmoji}>📱</Text>
                </View>

                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>
                  We've sent a 4-digit code to{'\n'}
                  <Text style={styles.emailText}>{email}</Text>
                </Text>

                {/* OTP Boxes */}
                <View style={styles.otpRow}>
                  {otp.map((val, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (inputs.current[index] = ref as any)}
                      style={[styles.otpBox, val ? styles.otpBoxActive : null]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={val}
                      onChangeText={text => handleChange(text, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      textAlign="center"
                      selectionColor={Colors.primary}
                    />
                  ))}
                </View>
                
                {(error || externalError) ? <Text style={styles.errorText}>{error || externalError}</Text> : null}

                <CustomButton 
                  title="Verify & Continue" 
                  onPress={handleVerify} 
                  loading={isLoading} 
                />

                <View style={styles.resendRow}>
                  <Text style={styles.resendText}>Didn't receive the code? </Text>
                  <TouchableOpacity onPress={() => setOtp(['', '', '', ''])}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    paddingBottom: hp('2%'),
    maxHeight: hp('90%'),
  },
  modalInner: {
    paddingHorizontal: wp('6%'),
  },
  header: {
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  indicator: {
    width: wp('12%'),
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: hp('1%'),
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: hp('2%'),
    padding: wp('2%'),
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: hp('2%'),
  },
  iconBox: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  iconEmoji: { ...Typography.body, color: Colors.primary },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('2.5%'),
    marginBottom: hp('2%'),
  },
  emailText: { color: Colors.primary, fontWeight: '700' },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: hp('2%'),
    gap: wp('3%'),
  },
  otpBox: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('3.5%'),
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    fontSize: wp('6%'),
    fontWeight: '700',
    color: Colors.textPrimary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  otpBoxActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    elevation: 1,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2.5%'),
  },
  resendText: { ...Typography.caption, color: Colors.textSecondary },
  resendLink: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
});

export default OTPVerificationModal;
