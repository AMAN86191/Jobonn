import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';

interface CategoryItemProps {
  icon: string;
  title: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ icon, title }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <Text style={styles.categoryIcon}>{icon}</Text>
    <Text style={styles.categoryTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center', marginRight: wp('6%'),
    backgroundColor: Colors.white, padding: wp('3%'),
    borderRadius: wp('4%'), minWidth: wp('18%'),
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryIcon: { ...Typography.caption, marginBottom: hp('0.5%') },
  categoryTitle: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },
});

export default CategoryItem;
