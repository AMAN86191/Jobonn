import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ManagerTabNavigator from './ManagerTabNavigator';
import { CustomDrawerContent } from './CustomDrawerContent';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();

const ManagerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: wp('75%'),
        },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="ManagerTabNavigator" component={ManagerTabNavigator} />
    </Drawer.Navigator>
  );
};

export default ManagerDrawerNavigator;
