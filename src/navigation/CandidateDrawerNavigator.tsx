import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CandidateTabNavigator from './CandidateTabNavigator';
import { CustomDrawerContent } from './CustomDrawerContent';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();

const CandidateDrawerNavigator = () => {
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
      <Drawer.Screen name="CandidateTabNavigator" component={CandidateTabNavigator} />
    </Drawer.Navigator>
  );
};

export default CandidateDrawerNavigator;
