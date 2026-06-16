import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  isPassword = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    borderColor: interpolateColor(
      focusAnim.value,
      [0, 1],
      [Colors.border, error ? Colors.danger : Colors.primary],
    ),
    borderWidth: withTiming(focusAnim.value > 0 ? 1.5 : 1, { duration: 150 }),
  }));

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
    scaleAnim.value = withSpring(1.01, { damping: 15, stiffness: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withSpring(0, { damping: 15, stiffness: 200 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[
        styles.inputWrapper,
        animatedWrapperStyle,
        error ? styles.errorBorder : null,
      ]}>
        <TextInput
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={Colors.textSecondary}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <Eye size={wp('4.5%')} color={Colors.primary} />
            ) : (
              <EyeOff size={wp('4.5%')} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('1.5%'),
    width: '100%',
  },
  label: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: hp('0.6%'),
    fontWeight: '600',
  },
  inputWrapper: {
    height: hp('5.5%'),
    minHeight: 48,
    backgroundColor: Colors.white,
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  input: {
    flex: 1,
    ...Typography.caption,
    color: Colors.textPrimary,
    height: '100%',
    paddingVertical: 0,
  },
  errorBorder: {
    borderColor: Colors.danger,
    borderWidth: 1.5,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: hp('0.5%'),
  },
  eyeIcon: {
    paddingLeft: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomInput;
