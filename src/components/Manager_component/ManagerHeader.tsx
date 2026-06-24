import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bell, Logs } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface ManagerHeaderProps {
  onNotifPress?: () => void;
  unreadCount?: number;
}

const ManagerHeader: React.FC<ManagerHeaderProps> = ({ onNotifPress, unreadCount = 3 }) => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);
  console.log('user', user)
  const name = user?.name || 'Manager';
  const company = user?.company?.company_name || 'JobONN';
  const firstName = name.split(' ')[0];

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.8}>
          {/* <View style={styles.avatar}>
            <Text >{name[0]?.toUpperCase()}</Text>
          </View> */}
          <Logs size={RFValue(16)} strokeWidth={2} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.companyText}>{company}</Text>
          <Text style={styles.welcomeText}>Hello, {firstName} 👋</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.notifBtn} onPress={onNotifPress} activeOpacity={0.7}>
        <Bell color={Colors.textPrimary} size={RFValue(13)} strokeWidth={2} />
        {unreadCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: wp('2%') },

  companyText: { fontSize: RFValue(8), color: Colors.textPrimary, fontWeight: '500', letterSpacing: 0.3 },
  welcomeText: { fontSize: RFValue(11), fontWeight: '700', color: Colors.textPrimary },
  notifBtn: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badge: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
    width: wp('1.8%'),
    height: wp('1.8%'),
    borderRadius: wp('1%'),
    backgroundColor: Colors.danger,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});

export default ManagerHeader;
