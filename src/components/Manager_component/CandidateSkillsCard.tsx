import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Code } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';

interface CandidateSkillsCardProps {
  skills?: string[];
}

const defaultSkills = [
  'React Native', 'TypeScript', 'Redux', 'Expo', 'Framer Motion', 
  'React Navigation', 'Redux Toolkit', 'Zustand', 'Tailwind CSS', 
  'Styled Components', 'React Testing Library', 'Jest', 'ESLint', 
  'Prettier', 'Git'
];

const CandidateSkillsCard: React.FC<CandidateSkillsCardProps> = ({ skills = defaultSkills }) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <Code size={RFValue(11)} color={Colors.primary} />
          <Text style={styles.sectionCardTitle}>Key Skills</Text>
        </View>
      </View>

      <View style={styles.skillsWrapper}>
        {skills.map((skill: string) => (
          <View key={skill} style={styles.skillOutlineChip}>
            <Text style={styles.skillOutlineChipText}>{skill}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('3.5%'),
    marginBottom: hp('1.2%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  sectionCardTitle: {
    fontSize: RFValue(9.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('1.8%'),
  },
  skillOutlineChip: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: wp('2.8%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 6,
  },
  skillOutlineChipText: {
    fontSize: RFValue(8.2),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default CandidateSkillsCard;
