import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
//import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localData, retrieveAllLocalData, updateLocalData } from './utils/localData';

import SplashScreen from './screens/Splash';
import OnboardingScreen from './screens/Onboarding';
import SignUpScreen from './screens/SignUp';
import LogInScreen from './screens/LogIn';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App:');
  
  const [isLoading, updateIsLoading] = useState(true);  
  const [isLoggedIn, updateIsLoggedIn] = useState(false);
  const [userData, updateUserData] = useState({
    name: '',
    email: '',
    password: '',
    online: '',
  })

  console.log('userData: ',userData);
  console.log('localData: ',localData);

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
      const userFirstName = await AsyncStorage.getItem('firstName');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');
      if (firstOpenComplete !== null) {
        console.log('firstOpenedComplete:',firstOpenComplete);
        updateIsLoading(false);
        //console.log('data exists');
        if(userLoggedIn !== null){

          if(userLoggedIn === 'true'){
            updateIsLoggedIn(true);
            updateUserData({
              name: userFirstName,
              email: userEmail,
              password: userPassword,
              online: userLoggedIn,
            })
            updateLocalData(userData.name, userData.email, userData.password, userData.online);
            console.log(`user ${userFirstName} is logged in: ${userLoggedIn}`);
          } else {
            console.log('not a user');
          }
        };
      }else{
        storeData();
      }; 
    } catch (error) {
      //retrieving error
      console.log('retrieving error on App.js: ', error);
    }
  };

  //retrieveData();
  //if app is still loading from AsyncStorage
  if(isLoading) { 
    //storeData();
    retrieveData();
    //retrieveAllLocalData();
    console.log('isLoading:',isLoading);
    return <SplashScreen/>;
  };
  //TODO: create logged in check/update -- runs too many calls.
  if(isLoggedIn){
    //retrieveData();
    updateLocalData(userData.name, userData.email, userData.password, userData.online);
    //localData.name = userData.name;
    //localData.online = true;
    console.log('isLoggedIn:',isLoggedIn);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        { //entire screen stack
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
        }
        {/*check for loggedin status*/
        //does not navigate between groups...idky?
          /*isLoggedIn ? ( 
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="LogIn" component={LogInScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="LogIn" component={LogInScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )
        
        */}
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
