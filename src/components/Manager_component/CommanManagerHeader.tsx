import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Edit3, LucideIcon } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';

interface CommanManagerHeaderProps {
  title: string;
  navigation: any;
  onBack?: () => void;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  showEdit?: boolean;
}

const CommanManagerHeader: React.FC<CommanManagerHeaderProps> = ({
  title,
  navigation,
  onBack,
  rightIcon: RightIcon,
  onRightPress,
  showEdit = false,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack || (() => navigation.goBack())}
        activeOpacity={0.7}
      >
        <ArrowLeft color={Colors.textPrimary} size={RFValue(13)} strokeWidth={2} />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>

      {showEdit || RightIcon ? (
        <TouchableOpacity style={styles.rightBtn} onPress={onRightPress} activeOpacity={0.7}>
          {RightIcon ? (
            <RightIcon color={Colors.primary} size={RFValue(12)} strokeWidth={2} />
          ) : (
            <Edit3 color={Colors.primary} size={RFValue(12)} strokeWidth={2} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: wp('2%'),
  },
  rightBtn: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholder: { width: wp('8%') },
});

export default CommanManagerHeader;
