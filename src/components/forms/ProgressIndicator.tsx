import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import {heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <Animated.View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundBar: {
    width: '100%',
    height: hp('0.8%'),
    backgroundColor: Colors.border,
    borderRadius: hp('0.4%'),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: hp('0.4%'),
  },
});

export default ProgressIndicator;
