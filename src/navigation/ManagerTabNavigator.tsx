import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Briefcase, Users,  User, Calendar } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

import ManagerHomeScreen from '../screens/manager/ManagerHomeScreen';
import ManagerJobsScreen from '../screens/manager/ManagerJobsScreen';
import ManagerApplicantsScreen from '../screens/manager/ManagerApplicantsScreen';
import ManagerInterviewsScreen from '../screens/manager/ManagerInterviewsScreen';
import ManagerProfileScreen from '../screens/manager/ManagerProfileScreen';
import { Colors } from '../theme/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  focused,
  color,
  size,
  IconComponent,
}: {
  focused: boolean;
  color: string;
  size: number;
  IconComponent: typeof Home;
}) => (
  <View style={[styles.iconWrap, focused && { backgroundColor: Colors.primaryLight }]}>
    <IconComponent color={color} size={RFValue(13)} strokeWidth={focused ? 2.5 : 2} />
  </View>
);

const ManagerTabNavigator = () => {
  const inset = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          left: wp('3%'),
          right: wp('3%'),
          bottom: Platform.OS === 'android'
            ? inset.bottom > 0 ? inset.bottom + hp('0.5%') : hp('1.5%')
            : inset.bottom + hp('1%'),
          backgroundColor: Colors.white,
          borderRadius: wp('5%'),
          height: hp('7.5%'),
          borderTopWidth: 0,
          paddingTop: hp('0.8%'),
          paddingBottom: hp('1%'),
          borderWidth: 1,
          borderColor: Colors.border,
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
        freezeOnBlur: true,
        tabBarButton: (props) => (
          <TouchableOpacity {...(props as any)} activeOpacity={0.8} />
        ),
      }}
    >
      <Tab.Screen
        name="ManagerHomeTab"
        component={ManagerHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused} color={color} size={size} IconComponent={Home} />
          ),
        }}
      />
      <Tab.Screen
        name="ManagerJobsTab"
        component={ManagerJobsScreen}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused} color={color} size={size} IconComponent={Briefcase} />
          ),
        }}
      />
      <Tab.Screen
        name="ManagerApplicantsTab"
        component={ManagerApplicantsScreen}
        options={{
          tabBarLabel: 'Applicants',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused} color={color} size={size} IconComponent={Users} />
          ),
        }}
      />
      <Tab.Screen
        name="ManagerInterviewsTab"
        component={ManagerInterviewsScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused} color={color} size={size} IconComponent={Calendar} />
          ),
        }}
      />
      <Tab.Screen
        name="ManagerProfileTab"
        component={ManagerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused} color={color} size={size} IconComponent={User} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: RFValue(7.5),
    fontWeight: '600',
    marginBottom: hp('0.3%'),
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('10%'),
    height: hp('3.5%'),
    borderRadius: wp('3%'),
  },
});

export default ManagerTabNavigator;
