import React from 'react';
import { Text, StyleSheet, View, Image, Pressable } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface SocialLoginButtonProps {
  type: 'google' | 'linkedin';
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ type, onPress }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getIcon = () => {
    const iconSize = wp('5%');
    switch (type) {
      case 'google':
        return (
          <Image
            source={require('../../../assets/images/google.png')}
            style={{ width: iconSize, height: iconSize }}
            resizeMode="contain"
          />
        );
      case 'linkedin':
        return (
          <Image
            source={require('../../../assets/images/linkedin.png')}
            style={{ width: iconSize, height: iconSize }}
            resizeMode="contain"
          />
        );
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'google': return 'Google';
      case 'linkedin': return 'LinkedIn';
      default: return '';
    }
  };

  return (
    <AnimatedPressable
      style={[styles.button, animStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
    >
      <View style={styles.iconBox}>
        {getIcon()}
      </View>
      <Text style={styles.text}>{getLabel()}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    height: hp('5.5%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('1%'),
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  iconBox: {
    marginRight: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default SocialLoginButton;
