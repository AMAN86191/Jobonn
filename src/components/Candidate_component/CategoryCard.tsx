import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { Code, Megaphone, LineChart, PenTool, Globe, Briefcase } from 'lucide-react-native';

interface CategoryCardProps {
  title: string;
  iconName: string;
  jobCount?: string;
  onPress?: () => void;
  isActive?: boolean;
}

const getIcon = (name: string, color: string, size: number) => {
  switch (name) {
    case 'Code': return <Code color={color} size={size} />;
    case 'Megaphone': return <Megaphone color={color} size={size} />;
    case 'LineChart': return <LineChart color={color} size={size} />;
    case 'PenTool': return <PenTool color={color} size={size} />;
    case 'Globe': return <Globe color={color} size={size} />;
    default: return <Briefcase color={color} size={size} />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({ title, iconName, jobCount, onPress, isActive }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isActive && styles.activeContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
        {getIcon(iconName, isActive ? Colors.white : Colors.primary, wp('5%'))}
      </View>
      <Text style={[styles.title, isActive && styles.activeText]} numberOfLines={1}>{title}</Text>
      {jobCount && <Text style={styles.countText}>{jobCount} Jobs</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: wp('3%'),
    borderRadius: wp('4%'),
    minWidth: wp('28%'),
    marginRight: wp('3%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  iconBox: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  activeIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: hp('0.2%'),
  },
  activeText: {
    color: Colors.white,
  },
  countText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});

export default CategoryCard;
