import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import SplashScreen from './screens/Splash';
import OnboardingScreen from './screens/Onboarding';
import ProfileScreen from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  //if app is still loading from AsyncStorage
  /*if(state.isLoading) { 
    return <SplashScreen/>;
  };*/

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        {/*TODO: check for signed in or pending onboarding*/}
        <Stack.Screen name="Little Lemon" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
