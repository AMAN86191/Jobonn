import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Animated,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ChevronLeft, Check, Circle } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../../components/buttons/CustomButton';
import CustomInput from '../../components/inputs/CustomInput';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
};

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (success) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [fadeAnim, scaleAnim, success]);


  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const hints = [
    { label: 'At least 6 characters', met: form.password.length >= 6 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'One number or symbol', met: /[0-9!@#$%^&*]/.test(form.password) },
  ];

  const handleReset = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  if (success) {
    return (
      <AppBackground>
        <View style={styles.successContainer}>
          {/* Decorative Background Shapes */}
          <View style={[styles.bgShape, styles.shape1]} />
          <View style={[styles.bgShape, styles.shape2]} />
          <View style={[styles.bgShape, styles.shape3]} />

          <Animated.View style={[
            styles.successContent,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}>
            <View style={styles.successIconBox}>
              <Text style={styles.successEmoji}>🎉</Text>
            </View>
            <Text style={styles.successTitle}>Password Set Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Your password has been set successfully.{'\n'}You can now sign in with your new password.
            </Text>
            <CustomButton
              title="Go to Dashboard"
              onPress={() => navigation.reset({
                index: 0,
                
                routes: [{ name: 'CandidateHome', params: { role: 'candidate' } }],
              })}

              style={styles.signInBtn}
            />
          </Animated.View>
        </View>
      </AppBackground>

    );
  }


  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp('5%')}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <ChevronLeft color={Colors.textPrimary} size={wp('6%')} />
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>🔑</Text>
          </View>

          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>
            Create a strong password that you'll remember easily.
          </Text>

          {/* Password Strength Hints */}
          <View style={styles.hintsCard}>
            <Text style={styles.hintsTitle}>Password Requirements:</Text>
            {hints.map((h, i) => (
              <View key={i} style={styles.hintRow}>
                {h.met ? (
                  <Check size={wp('4%')} color={Colors.success} style={styles.hintIcon} />
                ) : (
                  <Circle size={wp('4%')} color={Colors.textSecondary} style={styles.hintIcon} />
                )}
                <Text style={[styles.hintText, h.met && styles.hintTextActive]}>{h.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <CustomInput
              label="New Password"
              placeholder="Create a strong password"
              isPassword
              value={form.password}
              onChangeText={v => setForm(p => ({ ...p, password: v }))}
              error={errors.password}
            />
            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              isPassword
              value={form.confirmPassword}
              onChangeText={v => setForm(p => ({ ...p, confirmPassword: v }))}
              error={errors.confirmPassword}
            />
            <CustomButton title="Reset Password" onPress={handleReset} loading={loading} />
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: wp('2%'),
    paddingTop: hp('6%'),
    paddingBottom: hp('15%') // Extra padding for keyboard
  },
  backBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: hp('3%'),
  },
  iconBox: {
    width: wp('20%'), height: wp('20%'), borderRadius: wp('6%'),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: hp('2.5%'), alignSelf: 'center',

  },
  iconEmoji: { fontSize: wp('9%') },
  title: { ...Typography.h3, color: Colors.textPrimary, marginBottom: hp('1%'), textAlign: 'center' },
  subtitle: {
    ...Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: hp('3%'), marginBottom: hp('2.5%'),
  },
  hintsCard: {
    backgroundColor: Colors.white + 'CC', // 80% opacity white
    borderRadius: wp('4%'), padding: wp('4%'),
    marginBottom: hp('2.5%'), borderWidth: 1, borderColor: Colors.border,
  },
  hintsTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('1%'),
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.8%') },
  hintIcon: { marginRight: wp('2.5%') },
  hintText: { ...Typography.caption, color: Colors.textSecondary },
  hintTextActive: { color: Colors.success, fontWeight: '600' },
  card: {
    backgroundColor: Colors.white + 'CC', // 80% opacity white
    borderRadius: wp('5%'), padding: wp('5%'),

    marginBottom: hp('2%'),
  },

  // Success
  successContainer: {
    flex: 1,
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: wp('8%'),
    overflow: 'hidden',
  },
  successContent: {
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  bgShape: {
    position: 'absolute',
    borderRadius: wp('50%'),
    backgroundColor: Colors.primary + '08',
  },
  shape1: {
    width: wp('60%'), height: wp('60%'),
    top: -hp('10%'), right: -wp('20%'),
  },
  shape2: {
    width: wp('40%'), height: wp('40%'),
    bottom: hp('5%'), left: -wp('10%'),
    backgroundColor: Colors.secondary + '05',
  },
  shape3: {
    width: wp('20%'), height: wp('20%'),
    top: hp('20%'), left: wp('10%'),
    backgroundColor: Colors.primary + '05',
  },
  successIconBox: {
    width: wp('28%'), height: wp('28%'), borderRadius: wp('8%'),
    backgroundColor: Colors.success + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: hp('3%'),
  },
  successEmoji: { fontSize: wp('14%') },
  successTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: hp('1.5%'), textAlign: 'center' },
  successSubtitle: {
    ...Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: hp('3.2%'), marginBottom: hp('4%'),
  },
  signInBtn: { width: '100%', borderRadius: wp('3.5%') },
});


export default ResetPasswordScreen;
