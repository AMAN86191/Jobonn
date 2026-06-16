import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Allroute';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashScreen'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoRotateZ = useSharedValue(-10);
  const textTranslateY = useSharedValue(30);
  const textOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(15);
  const footerOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    // Logo entrance - spring bounce
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100, mass: 0.8 });
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoRotateZ.value = withSpring(0, { damping: 12, stiffness: 100 });

    // App name slide up
    textTranslateY.value = withDelay(400, withSpring(0, { damping: 14, stiffness: 120 }));
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    // Tagline
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    taglineTranslateY.value = withDelay(800, withSpring(0, { damping: 14, stiffness: 120 }));

    // Footer
    footerOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));

    // Pulsing glow effect on logo
    glowScale.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ));
    glowOpacity.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(0.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ));

    const timer = setTimeout(() => navigation.replace('Onboarding'), 2800);
    return () => clearTimeout(timer);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotateZ.value}deg` },
    ],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const footerAnimStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <View style={styles.logoWrapper}>
        {/* Glow ring behind logo */}
        <Animated.View style={[styles.glowRing, glowAnimStyle]} />

        <Animated.View style={[styles.logoBox, logoAnimStyle]}>
          <Text style={styles.logoLetter}>J</Text>
        </Animated.View>

        <Animated.Text style={[styles.logoText, textAnimStyle]}>
          JobOnn
        </Animated.Text>

        <Animated.Text style={[styles.tagline, taglineAnimStyle]}>
          Your Career Starts Here
        </Animated.Text>
      </View>

      <Animated.View style={[styles.footer, footerAnimStyle]}>
        <View style={styles.poweredRow}>
          <View style={styles.poweredDot} />
          <Text style={styles.footerText}>Powered by Jobonn</Text>
          <View style={styles.poweredDot} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    top: -wp('4%'),
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    backgroundColor: Colors.primary,
  },
  logoBox: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: hp('1.5%') },
    shadowOpacity: 0.6,
    shadowRadius: wp('8%'),
    elevation: 20,
  },
  logoLetter: {
    ...Typography.h2,
    color: Colors.white,
  },
  logoText: {
    fontSize: wp('9%'),
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 2,
    marginBottom: hp('1%'),
  },
  tagline: {
    ...Typography.bodySmall,
    color: Colors.primary,
    letterSpacing: 1.5,
    marginTop: hp('0.5%'),
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: hp('5%'),
  },
  poweredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  poweredDot: {
    width: wp('1%'),
    height: wp('1%'),
    borderRadius: wp('0.5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  footerText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.35)',
  },
});

export default SplashScreen;
