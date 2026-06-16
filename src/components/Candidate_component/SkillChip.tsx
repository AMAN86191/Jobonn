import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface SkillChipProps {
  skill: string;
}

const SkillChip: React.FC<SkillChipProps> = ({ skill }) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{skill}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  text: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default SkillChip;
