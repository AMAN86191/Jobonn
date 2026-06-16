import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../theme/Colors';
import { useNavigation } from '@react-navigation/native';

interface MainManagerHeaderProps {
  title: string;
  subtitle: string;
  rightComponent?: React.ReactNode;
}

const MainManagerHeader: React.FC<MainManagerHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
}) => {
  const navigation = useNavigation<any>();


  return (

    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {/* {hasDrawer && (
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Menu size={RFValue(13)} color={Colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
        )} */}
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {rightComponent && <View>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  menuBtn: {
    paddingRight: wp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: RFValue(14),
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: RFValue(8.5),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: hp('0.1%'),
  },
});

export default MainManagerHeader;
