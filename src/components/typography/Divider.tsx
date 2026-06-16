import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface DividerProps {
  label?: string;
}

const Divider: React.FC<DividerProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {label && <Text style={styles.text}>{label}</Text>}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginHorizontal: wp('3%'),
  },
});

export default Divider;
