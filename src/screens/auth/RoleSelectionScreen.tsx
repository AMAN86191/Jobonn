import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, Pressable,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import { ChevronLeft } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import CustomButton from '../../components/buttons/CustomButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;
  route: RouteProp<RootStackParamList, 'RoleSelection'>;
};

type Role = 'candidate' | 'company' | 'consultancy' | 'agent';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RoleCard = ({
  role,
  isSelected,
  onSelect,
}: {
  role: { key: Role; title: string; subtitle: string; lottie: any; features: string[] };
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        scale.value = withSpring(0.97, { damping: 10, stiffness: 300 });
        setTimeout(() => {
          scale.value = withSpring(1, { damping: 8, stiffness: 150 });
        }, 100);
        onSelect();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      style={[styles.card, isSelected && styles.cardSelected, animStyle]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.lottieBox, isSelected && styles.lottieBoxSelected]}>
          <LottieView
            source={role.lottie}
            autoPlay
            loop
            style={styles.lottieIcon}
          />
        </View>
        <View style={styles.cardMeta}>
          <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>{role.title}</Text>
          <Text style={[styles.roleSubtitle, isSelected && styles.roleSubtitleSelected]}>{role.subtitle}</Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && (
            <Animated.View
              entering={FadeInDown.duration(200).springify()}
              style={styles.radioDot}
            />
          )}
        </View>
      </View>

      <View style={styles.featureRow}>
        {role.features.map((f, i) => (
          <View key={i} style={[styles.featureChip, isSelected && styles.featureChipSelected]}>
            <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>✓ {f}</Text>
          </View>
        ))}
      </View>
    </AnimatedPressable>
  );
};

const RoleSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const fromSignup = route.params?.fromSignup ?? false;

  const roles = [
    {
      key: 'candidate' as Role,
      title: 'Job Seeker',
      subtitle: 'Find and apply to your dream jobs',
      lottie: require('../../../assets/lotie/Job Search1.json'),
      features: ['Browse 1000+ jobs', 'One-tap apply', 'Track applications'],
    },
    {
      key: 'company' as Role,
      title: 'Individual Company',
      subtitle: 'Post jobs and hire top talent',
      lottie: require('../../../assets/lotie/3.json'),
      features: ['Post jobs', 'ATS pipeline', 'Interview scheduling'],
    },
    // {
    //   key: 'consultancy' as Role,
    //   title: 'Consultancy',
    //   subtitle: 'Manage multiple clients and recruiters',
    //   lottie: require('../../../assets/lotie/company.json'),
    //   features: ['Company switcher', 'Recruiter teams', 'Package limits'],
    // },
    // {
    //   key: 'agent' as Role,
    //   title: 'Jobonn Agent',
    //   subtitle: 'Source candidates for assigned companies',
    //   lottie: require('../../../assets/lotie/3.json'),
    //   features: ['Assigned companies', 'Candidate sourcing', 'Hiring operations'],
    // },
  ];

  const handleContinue = () => {
    if (!selectedRole) return;
    const appRole = selectedRole === 'candidate' ? 'candidate' : 'manager';
    if (fromSignup) {
      navigation.navigate('Signup', { role: appRole });
    } else {
      navigation.navigate('Login', { role: appRole });
    }
  };

  return (
    <AppBackground>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View
          style={styles.header}
        >
          {fromSignup && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <ChevronLeft color={Colors.textPrimary} size={wp('6%')} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {fromSignup ? 'I want to...' : 'I am a...'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {fromSignup
              ? 'Select your role to create the right account'
              : 'Choose your role to get started with a personalized experience'}
          </Text>
        </View>

        {/* Role Cards */}
        {roles.map((role) => (
          <View
            key={role.key}

          >
            <RoleCard
              role={role}
              isSelected={selectedRole === role.key}
              onSelect={() => setSelectedRole(role.key)}
            />
          </View>
        ))}

        <View

          style={styles.btnWrapper}
        >
          <CustomButton
            title={fromSignup ? 'Create Account' : 'Continue'}
            onPress={handleContinue}
            disabled={!selectedRole}
          />
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Login', {})}>
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp('2%'),
    paddingTop: hp('6%'),
    paddingBottom: hp('4%'),
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
    marginBottom: hp('2%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { marginBottom: hp('3%') },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary, marginBottom: hp('0.5%') },
  headerSubtitle: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: hp('2.8%') },

  card: {
    backgroundColor: Colors.white,
    borderRadius: wp('5%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  cardSelected: {
    borderColor: Colors.primary,
    // backgroundColor: Colors.primary + '08',
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    elevation: 6,
  },

  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('2%') },
  lottieBox: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('4%'),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
    overflow: 'hidden',
  },
  lottieBoxSelected: { backgroundColor: Colors.primary },
  lottieIcon: { width: '100%', height: '100%' },
  cardMeta: { flex: 1 },
  roleTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 2 },
  roleTitleSelected: { color: Colors.secondary },
  roleSubtitle: { ...Typography.caption, color: Colors.textSecondary },
  roleSubtitleSelected: { color: Colors.textSecondary },

  radio: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: wp('2.75%'),
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: Colors.primary,
  },

  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wp('2%') },
  featureChip: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('2%'),
    backgroundColor: '#F3F4F6',
  },
  featureChipSelected: { backgroundColor: Colors.primary + '15' },
  featureText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '500' },
  featureTextSelected: { color: Colors.primary, fontWeight: '600' },

  btnWrapper: { marginTop: hp('1%') },

  signInText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: hp('3%'),
  },
  signInLink: { color: Colors.primary, fontWeight: '700' },
});

export default RoleSelectionScreen;
