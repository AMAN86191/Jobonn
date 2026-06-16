import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { Briefcase, MapPin, DollarSign, Users } from 'lucide-react-native';

interface JobInfoCardProps {
  type: 'mode' | 'experience' | 'salary' | 'openings';
  value: string;
}

const JobInfoCard: React.FC<JobInfoCardProps> = ({ type, value }) => {
  const getIcon = () => {
    switch (type) {
      case 'mode': return <MapPin color={Colors.primary} size={wp('5%')} />;
      case 'experience': return <Briefcase color={Colors.primary} size={wp('5%')} />;
      case 'salary': return <DollarSign color={Colors.primary} size={wp('5%')} />;
      case 'openings': return <Users color={Colors.primary} size={wp('5%')} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'mode': return 'Work Mode';
      case 'experience': return 'Experience';
      case 'salary': return 'Salary';
      case 'openings': return 'Openings';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View>
        <Text style={styles.label}>{getLabel()}</Text>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: wp('3%'),
    borderRadius: wp('3%'),
    width: '48%',
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: hp('0.2%'),
  },
  value: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});

export default JobInfoCard;
