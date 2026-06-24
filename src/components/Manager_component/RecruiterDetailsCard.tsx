import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { User, Calendar } from 'lucide-react-native';
import RAnimated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import ContactCardScreen from './ContactCardScreen';

interface RecruiterDetailsCardProps {
  name: string;
  jobTitle?: string;
  createdAt?: string;
  email: string;
  phone: string;
}

export const RecruiterDetailsCard: React.FC<RecruiterDetailsCardProps> = React.memo(({
  name,
  jobTitle,
  createdAt,
  email,
  phone,
}) => {
  const getAvatarInitials = () => {
    if (!name) return 'RM';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formattedJoinDate = () => {
    if (!createdAt) return 'recently';
    return createdAt.split('T')[0];
  };

  return (
    <RAnimated.View entering={FadeInDown.duration(400).delay(100)} style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <User color={Colors.primary} size={RFValue(11)} />
          <Text style={styles.sectionCardTitle}>Recruiter Details</Text>
        </View>
      </View>

      <View style={styles.recruiterProfileBlock}>
        <View style={styles.recruiterAvatarWrapper}>
          <View style={styles.recruiterAvatar}>
            <Text style={styles.recruiterAvatarText}>{getAvatarInitials()}</Text>
          </View>
          <View style={styles.recruiterActiveIndicator} />
        </View>

        <View style={styles.recruiterInfoBlock}>
          <Text style={styles.recruiterNameText}>{name || 'N/A'}</Text>
          <Text style={styles.recruiterRoleText}>{jobTitle || 'Recruiter'}</Text>
          <View style={styles.joinDateRow}>
            <Calendar size={RFValue(8.5)} color={Colors.textSecondary} />
            <Text style={styles.joinDateText}>Joined {formattedJoinDate()}</Text>
          </View>
        </View>
      </View>

      {(!!email || !!phone) && (
        <>
          <View style={styles.dividerLight} />
          <ContactCardScreen email={email} phone={phone} />
        </>
      )}
    </RAnimated.View>
  );
});

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: wp('2%'),
    marginBottom: hp('1%'),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
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
  recruiterProfileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  recruiterAvatarWrapper: {
    position: 'relative',
    marginRight: wp('3%'),
  },
  recruiterAvatar: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: '#EEF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recruiterAvatarText: {
    fontSize: RFValue(10.5),
    color: Colors.primary,
    fontWeight: '700',
  },
  recruiterActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: wp('2.8%'),
    height: wp('2.8%'),
    borderRadius: wp('1.4%'),
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  recruiterInfoBlock: {
    flex: 1,
  },
  recruiterNameText: {
    fontSize: RFValue(10),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recruiterRoleText: {
    fontSize: RFValue(8.2),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.1%'),
  },
  joinDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    gap: wp('1.5%'),
  },
  joinDateText: {
    fontSize: RFValue(8),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: hp('1.2%'),
  },
});

export default RecruiterDetailsCard;
