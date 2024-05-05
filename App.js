import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
//import { StatusBar } from 'expo-status-bar';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './screens/Splash';
import OnboardingScreen from './screens/Onboarding';
import ProfileScreen from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, updateIsLoading] = useState(true);  
  const [isLoggedIn, updateIsLoggedIn] = useState(false);

  const storeData = async () => {
    console.log('saving data:');
    try {
      await AsyncStorage.setItem(
        'firstOpenComplete',
        'true'
      )
      console.log('saving data');
    } catch (error) {
      //saving error
      console.log('saving error');
    }
  };
  const retrieveData = async () => {
    console.log('retrieving data:');
    try {
      const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
      if (firstOpenComplete !== null) {
        //data exists
        console.log('firstOpenedComplete:',firstOpenComplete);
        updateIsLoading(false);
        //console.log('data exists');
      } 
    } catch (error) {
      //retrieving error
      console.log('retrieving error');
    }
  };

  //if app is still loading from AsyncStorage
  if(isLoading) { 
    storeData();
    retrieveData();
    console.log('isLoading:',isLoading);
    //return <SplashScreen/>;
  };
  //TODO: create logged in check/update
  if(!isLoggedIn){

  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/*check for loading status & loggedin status*/
          isLoading == true ? ( 
            <Stack.Screen name="Little Lemon" component={SplashScreen} />
          ) : (
            isLoggedIn == false ? ( 
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : (
              <Stack.Screen name="Profile" component={ProfileScreen} />
            )
          )
        }
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
