import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Home, Briefcase, Users, Calendar, User, LogOut, X, Mail, ChevronRight, FileText, BarChart3, CreditCard, FileClock } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/Colors';

const managerDrawerItems = [
  { label: 'Home', icon: Home, routeName: 'ManagerHomeTab' },
  { label: 'Jobs', icon: Briefcase, routeName: 'ManagerJobsTab' },
  { label: 'Applicants', icon: Users, routeName: 'ManagerApplicantsTab' },
  { label: 'Profile', icon: User, routeName: 'ManagerProfileTab' },
  { label: 'Reports', icon: BarChart3, routeName: 'ManagerAnalytics', root: true },
  { label: 'Packages', icon: CreditCard, routeName: 'PackageManagement', root: true },
  { label: 'Schedule Interviews', icon: Calendar, routeName: 'ManagerInterviewsTab' },
  // { label: 'Audit Logs', icon: FileClock, routeName: 'AuditLogs', root: true },
];

const candidateDrawerItems = [
  { label: 'Home', icon: Home, routeName: 'HomeTab' },
  { label: 'Jobs', icon: Briefcase, routeName: 'JobsTab' },
  { label: 'Applied Jobs', icon: FileText, routeName: 'AppliedJobs' },
  { label: 'Invites', icon: Mail, routeName: 'InvitesTab' },
  { label: 'Profile', icon: User, routeName: 'ProfileTab' },
];

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { navigation, state } = props;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUser(JSON.parse(data));
    };
    loadUser();
  }, []);

  const isCandidate = state.routes[0]?.name === 'CandidateTabNavigator';
  const drawerItems = isCandidate ? candidateDrawerItems : managerDrawerItems;

  const name = user?.name || (isCandidate ? 'User' : 'Company');
  const email = user?.email || (isCandidate ? 'user@gmail.com' : 'company@jobonn.com');

  const nestedState = state.routes[0]?.state;
  const activeTabName = nestedState
    ? nestedState.routes[nestedState.index ?? 0].name
    : (isCandidate ? 'HomeTab' : 'ManagerHomeTab');

  const handleNavigate = (routeName: string) => {
    if (isCandidate) {
      if (routeName === 'AppliedJobs') {
        navigation.navigate('AppliedJobs');
      } else {
        navigation.navigate('CandidateTabNavigator', { screen: routeName });
      }
    } else {
      const item = managerDrawerItems.find(drawerItem => drawerItem.routeName === routeName);
      if (item?.root) {
        navigation.navigate(routeName);
      } else {
        navigation.navigate('ManagerTabNavigator', { screen: routeName });
      }
    }
    navigation.closeDrawer();
  };

  const handleLogout = () => {
    navigation.closeDrawer();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login', params: { role: isCandidate ? 'candidate' : 'company' } }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Drawer Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
            <Text style={styles.emailText} numberOfLines={1}>{email}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.closeDrawer()}>
            <X size={RFValue(18)} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>
            {isCandidate 
              ? 'Find the perfect job\nthat matches\nyour skills.'
              : 'Hire the best talent\nto build your\ndream team.'}
          </Text>
        </View>
        <View style={styles.bannerGraphic}>
          {isCandidate ? (
            <Briefcase size={RFValue(35)} color={Colors.white} />
          ) : (
            <Users size={RFValue(35)} color={Colors.white} />
          )}
        </View>
      </View>

      {/* Drawer Navigation List */}
      <View style={styles.menuList}>
        {drawerItems.map((item) => {
          const isActive = activeTabName === item.routeName;
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.routeName}
              style={[styles.menuItem, isActive && styles.activeMenuItem]}
              onPress={() => handleNavigate(item.routeName)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Icon size={RFValue(13)} color={isActive ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.menuItemText, isActive && styles.activeMenuItemText]}>
                  {item.label}
                </Text>
              </View>
              <ChevronRight size={RFValue(12)} color={isActive ? Colors.primary : Colors.textSecondary} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Drawer Footer / Logout */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={RFValue(14)} color={Colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: hp('5%'),
  },
  header: {
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('2%'),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  avatar: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: RFValue(18),
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emailText: {
    fontSize: RFValue(9),
    color: Colors.textSecondary,
    marginTop: hp('0.3%'),
  },
  closeBtn: {
    padding: wp('1%'),
  },
  bannerContainer: {
    marginHorizontal: wp('3%'),
    backgroundColor: Colors.primary,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  bannerContent: {
    flex: 1,
  },
  bannerText: {
    color: Colors.white,
    fontSize: RFValue(10),
    fontWeight: '500',
    lineHeight: RFValue(15),
  },
  bannerGraphic: {
    padding: wp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp('3%'),
  },
  menuList: {
    flex: 1,
    paddingHorizontal: wp('3%'),
    paddingTop: hp('1%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('0.5%'),
  },
  activeMenuItem: {
    backgroundColor: Colors.primaryLight || '#F3E8FF',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  menuItemText: {
    fontSize: RFValue(10.5),
    color: Colors.textSecondary,
    marginLeft: wp('2%'),
  },
  activeMenuItemText: {
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight || '#F3F4F6',
    marginBottom: hp('2%'),
  },
  footer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('4%'),
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    gap: wp('3%'),
  },
  logoutText: {
    fontSize: RFValue(11),
    color: Colors.danger,
    fontWeight: '600',
  },
});
