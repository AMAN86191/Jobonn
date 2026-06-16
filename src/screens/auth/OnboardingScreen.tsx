import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Animated, StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { Spacing } from '../../theme/Theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Allroute';
import AppBackground from '../../components/layout/AppBackground';
import CustomButton from '../../components/buttons/CustomButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const slides = [
  {
    id: '1',
    title: 'Find Your Dream Job',
    subtitle: 'Browse thousands of jobs from top companies. Your next opportunity is just a tap away.',
    bg: '#EFF6FF',
    lottie: require('../../../assets/lotie/onboarding1.json'),
  },
  {
    id: '3',
    title: 'Get Hired Faster',
    subtitle: 'Smart matching connects you with the right roles. Apply with one tap and track your progress.',
    bg: '#EFF6FF',
    lottie: require('../../../assets/lotie/3.json'),
  },
];

const SCREEN_WIDTH = wp('100%');

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login', { role: 'candidate' });
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={slides[currentIndex].bg} />

        {/* Slides */}
        <Animated.FlatList
          ref={flatRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onMomentumScrollEnd={e => {
            setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
          }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <View style={styles.lottieWrapper}>
                <LottieView
                  source={item.lottie}
                  autoPlay={currentIndex === index}
                  loop
                  style={styles.lottie}
                />
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          )}
        />

        {/* Skip Button (Rendered after FlatList to ensure touch priority) */}
        <RAnimated.View entering={FadeInDown.duration(400).delay(300)}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.replace('Login', { role: 'candidate' })}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </RAnimated.View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [wp('2%'), wp('7%'), wp('2%')],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: [Colors.textSecondary, Colors.primary, Colors.textSecondary],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: dotColor }]}
              />
            );
          })}
        </View>

        {/* Next / Get Started Button */}
        <View

          style={styles.footer}
        >
          <CustomButton
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={goNext}
          />
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: hp('6.5%'),
    right: wp('6%'),
    zIndex: 10,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: wp('5%'),
  },
  skipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('8%'),
  },
  lottieWrapper: {
    width: wp('80%'),
    height: hp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  slideTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.m,
    fontWeight: '800',
  },
  slideSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp('3.2%'),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  dot: {
    height: hp('0.8%'),
    borderRadius: hp('0.4%'),
    backgroundColor: Colors.primary,
    marginHorizontal: wp('1%'),
  },
  footer: {
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('6%'),
  },
});

export default OnboardingScreen;
