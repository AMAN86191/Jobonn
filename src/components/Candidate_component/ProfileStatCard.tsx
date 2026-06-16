import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../theme/Colors';
import { Typography } from '../../theme/Typography';
import { Bookmark, Send } from 'lucide-react-native';

interface ProfileStatCardProps {
  type: 'saved' | 'applied';
  count: number;
}

const ProfileStatCard: React.FC<ProfileStatCardProps> = ({ type, count }) => {
  const isSaved = type === 'saved';
  
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: isSaved ? Colors.secondary + '15' : Colors.primary + '15' }]}>
        {isSaved ? (
          <Bookmark color={Colors.primary} size={wp('6%')} />
        ) : (
          <Send color={Colors.primary} size={wp('6%')} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{isSaved ? 'Saved Jobs' : 'Applied Jobs'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: wp('3.5%'),
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBox: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  info: {
    flex: 1,
  },
  count: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: -hp('0.5%'),
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});

export default ProfileStatCard;
