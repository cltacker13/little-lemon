import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
//import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { localData, retrieveAllLocalData, updateLocalData } from './utils/localData';

import SplashScreen from './screens/Splash';
import OnboardingScreen from './screens/Onboarding';
import SignUpScreen from './screens/SignUp';
import LogInScreen from './screens/LogIn';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import ItemScreen from './screens/ItemDetails';
import CartScreen from './screens/Cart';

const Stack = createNativeStackNavigator();

//console.log('all local data:',retrieveAllLocalData());
LogBox.ignoreLogs([   'Non-serializable values were found in the navigation state', 
  //  'Each child in a list should have a unique "key" prop',
  ]);

export default function App() {
  console.log('App:');
  //retrieveAllLocalData();
  const [isLoading, updateIsLoading] = useState(true);  
  const [isLoggedIn, updateIsLoggedIn] = useState(false);

  //console.log('localData: ',localData);

  const storeData = async () => {
    console.log('saving data...');
    try {
      await AsyncStorage.setItem(
        'firstOpenComplete', 'true'
      )
      //console.log('saved firstopen data');
      retrieveData();
    } catch (error) {
      //saving error
      console.log('saving error');
    }
  };
  const retrieveData = async () => {
    //console.log('retrieving data...');
    try {
      const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      const userFirstName = await AsyncStorage.getItem('firstName');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');
      console.log('App retrieved:',firstOpenComplete,userLoggedIn)
      if (firstOpenComplete !== null) {
        //console.log('firstOpenedComplete:',firstOpenComplete);
        updateIsLoading(false);
        //console.log('data exists');
        if(userLoggedIn !== null){

          if(userLoggedIn === 'true'){
            updateIsLoggedIn(true);
            //updateLocalData(userFirstName, userEmail, userPassword, userLoggedIn);
            //console.log('retrieve local data on App:',localData)
            //console.log(`user ${userFirstName} is logged in: ${userLoggedIn}`);
          } else {
            console.log('not a user');
          }
        };
      }else{
        storeData();
        console.log('new load.')
      }; 
    } catch (error) {
      //retrieving error
      console.log('retrieving error on App.js: ', error);
    }
  };

  useEffect(() => {
    retrieveData(); 
  },[]);
  
  //retrieveData();  
  //retrieveAllLocalData();
/*
  //if app is still loading from AsyncStorage
  if(isLoading) { 
    //storeData();
    //retrieveData();
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
  }*/

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        {/* //entire screen stack initialRouteName="Home"
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
        */}
        {/*check for loggedin status*/
        //cannot manually nav btwn groups, automatically navs based on criteria.
          isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (
            isLoggedIn ? ( 
              <>
                <Stack.Screen name="Home" component={HomeScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="ItemDetails" component={ItemScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="Cart" component={CartScreen} initialParams={{ updateIsLoggedIn }}/>
              </>
            ) : (
              <>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="SignUp" component={SignUpScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="LogIn" component={LogInScreen} initialParams={{ updateIsLoggedIn }}/>
              </>
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
