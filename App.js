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
import SignUpScreen from './screens/SignUp';
import LogInScreen from './screens/LogIn';
import ProfileScreen from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, updateIsLoading] = useState(true);  
  const [isLoggedIn, updateIsLoggedIn] = useState(false);

  const storeData = async () => {
    console.log('saving data...');
    try {
      await AsyncStorage.setItem(
        'firstOpenComplete', 'true'
      )
      //use to reset user status
      /*await AsyncStorage.setItem(
        'userLoggedIn', 'false'
      )*/
      console.log('saved data');
    } catch (error) {
      //saving error
      console.log('saving error');
    }
  };
  const retrieveData = async () => {
    console.log('retrieving data...');
    try {
      const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      if (firstOpenComplete !== null) {
        console.log('firstOpenedComplete:',firstOpenComplete);
        updateIsLoading(false);
        //console.log('data exists');
        if(userLoggedIn !==null){
          console.log('not a user');

          if(userLoggedIn === 'true'){
            updateIsLoggedIn(true);
            console.log('user is logged in: ',userLoggedIn);
          }
        };
      }; 
    } catch (error) {
      //retrieving error
      console.log('retrieving error');
    }
  };

  retrieveData();
  //if app is still loading from AsyncStorage
  if(isLoading) { 
    storeData();
    retrieveData();
    console.log('isLoading:',isLoading);
    return <SplashScreen/>;
  };
  //TODO: create logged in check/update
  if(true){
    retrieveData();
    console.log('isLoggedIn:',isLoggedIn);
    //return <OnboardingScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignUp' screenOptions={{ headerShown: false }}>
        {/*<Stack.Screen name='Splash' component={SplashScreen} screenOptions={{ headerShown: false }}/>*/}
        {/*<Stack.Screen name='Onboarding' component={OnboardingScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='LogIn' component={LogInScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
  */}
        {/*check for loading status & loggedin status*/
        //does not navigate between groups...idky?
          isLoggedIn == true ? ( 
            <>
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="LogIn" component={LogInScreen} />
            </>
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
