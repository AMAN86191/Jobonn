import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bell } from 'lucide-react-native';
import { Colors } from '../../theme/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CandidateHeader = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  const name = user?.name || 'User';
  const firstName = name.split(' ')[0];

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.userName}>{firstName}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
        <Bell color={Colors.textPrimary} size={RFValue(13)} strokeWidth={2} />
        <View style={styles.notifBadge} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    paddingTop: hp('0.5%'),
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: wp('2.5%') },
  avatar: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: Colors.white, fontSize: RFValue(12), fontWeight: '700' },
  greeting: { fontSize: RFValue(9), color: Colors.textTertiary, fontWeight: '500' },
  userName: { fontSize: RFValue(14), fontWeight: '800', color: Colors.textPrimary },
  notifBtn: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('2.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifBadge: {
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

export default CandidateHeader;
