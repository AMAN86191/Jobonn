import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { X, Lock } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../buttons/CustomButton';
import CustomInput from '../inputs/CustomInput';

interface CreatePasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  loading?: boolean;
}

const CreatePasswordModal: React.FC<CreatePasswordModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password.length < 8){
      setError('Password must be at least 8characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    onSubmit(password);
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

              <View style={styles.iconBox}>
                <Lock color={Colors.primary} size={wp('8%')} />
              </View>

              <Text style={styles.title}>Create Password</Text>
              <Text style={styles.subtitle}>
                Set a secure password for your new account
              </Text>

              <CustomInput
                label="New Password"
                placeholder="••••••••"
                isPassword
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
              />

              <CustomInput
                label="Confirm Password"
                placeholder="••••••••"
                isPassword
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                error={error}
              />

                <CustomButton
                  title="Finish & Create Account"
                  onPress={handleSubmit}
                  loading={loading}
                />
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
  keyboardView: { width: '100%' },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    paddingBottom: hp('4%'),
    maxHeight: hp('90%'),
  },
  modalInner: { paddingHorizontal: wp('6%') },
  header: { alignItems: 'center', paddingVertical: hp('2%') },
  indicator: {
    width: wp('12%'),
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: hp('1%'),
  },
  closeBtn: { position: 'absolute', right: 0, top: hp('2%'), padding: wp('2%') },
  iconBox: {
    alignSelf: 'center',
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  title: { ...Typography.h3, color: Colors.textPrimary, textAlign: 'center', marginBottom: hp('1%') },
  subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', marginBottom: hp('3%') },
});

export default CreatePasswordModal;
