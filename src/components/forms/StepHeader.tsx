import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface StepHeaderProps {
  title: string;
  subtitle: string;
  stepNumber: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, subtitle, stepNumber }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepText}>Step {stepNumber}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('3%'),
    alignItems: 'flex-start',
  },
  stepBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  stepText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: hp('0.5%'),
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});

export default StepHeader;
